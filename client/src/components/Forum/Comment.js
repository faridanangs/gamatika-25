'use client';
import { useRef, useState } from 'react';
import { ImageModal } from './ImageUpload';

export function Comment({ comment }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  return (
    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-600 last:border-0">
      <div className="flex items-start">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h4 className="font-semibold text-gray-800 dark:text-white">
              {comment.author.name}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {comment.timestamp}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-1">
            {comment.content}
          </p>
          {comment.images && comment.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {comment.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`Comment image ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal untuk komentar */}
      <ImageModal
        image={selectedImage}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
      />
    </div>
  );
}

export function CommentInput({ onAddComment }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    if (content.trim() || images.length > 0) {
      // Pastikan images adalah array URL string
      onAddComment({ content, images: [...images] });
      setContent('');
      setImages([]);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Konversi FileList ke array
      const files = Array.from(e.target.files);

      // Proses setiap file secara berurutan
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Tambahkan gambar baru ke state
          setImages((prev) => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border-0 focus:ring-0 dark:bg-gray-700 dark:text-white resize-none"
        placeholder="Tulis komentar Anda..."
      />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 my-2">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt={`Uploaded ${index}`}
                className="w-16 h-16 object-cover rounded"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handleImageClick}
          className="text-gray-500 hover:text-blue-500 flex items-center text-sm"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Foto/Video
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        <button
          onClick={handleSubmit}
          disabled={!content.trim() && images.length === 0}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            content.trim() || images.length > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Komentar
        </button>
      </div>
    </div>
  );
}
