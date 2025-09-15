'use client';

import Image from 'next/image';
import { useState } from 'react';

export function ImageUpload({ images, setImages, maxImages = 4 }) {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploading(true);

      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('images', file);
        });

        const response = await fetch('/api/auth/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();

        // Tambahkan gambar yang sudah diupload ke state
        const newImages = data.images.map((img, index) => ({
          id: Date.now() + index,
          url: img.url,
          public_id: img.public_id,
          file: files[index],
        }));

        console.log('new Images ', newImages);

        setImages((prev) => [...prev, ...newImages]);
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Gagal mengunggah gambar: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 mb-2">
        Gambar (maksimal {maxImages})
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <Image
                src={image.url}
                alt="Uploaded"
                width={60}
                height={60}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => removeImage(image.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              disabled={uploading}
            />
            <div className="text-center">
              {uploading ? (
                <div className="w-8 h-8 mx-auto">
                  <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-xs text-gray-500 mt-1">Tambah Gambar</p>
                </>
              )}
            </div>
          </label>
        )}
      </div>
    </div>
  );
}

export function ImageModal({ image, isOpen, onClose }) {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-3xl bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="relative max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute -top-1 -right-1 text-white bg-black bg-opacity-50 rounded-full p-1 z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <Image
          src={image}
          alt="Show image"
          width={1000}
          height={1000}
          className="w-full h-[50vh] md:h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}
