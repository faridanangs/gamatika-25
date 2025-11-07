'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';

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

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT_API_URL}api/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

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

        setImages((prev) => [...prev, ...newImages]);
      } catch (error) {
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

  // Gunakan portal untuk memastikan modal dirender di root level
  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="relative max-w-5xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 text-white bg-black/70 rounded-full p-2 z-50 hover:bg-black/90 transition-colors"
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
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="bg-black/20 rounded-lg p-2">
          <Image
            src={image}
            alt="Show image"
            width={1200}
            height={800}
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
