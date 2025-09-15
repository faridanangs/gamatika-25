'use client';
import { useState, useRef } from 'react';
import { ImageModal } from './ImageUpload';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export function Comment({ comment, isCurrentUser = false }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  return (
    <div
      className={cn(
        'mb-4 pb-4 border-b border-gray-200 dark:border-gray-600 last:border-0 transition-all duration-300',
        isCurrentUser && 'bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3'
      )}
    >
      <div className="flex items-start">
        {/* Avatar dengan indikator user */}
        <div className="relative">
          <img
            src={
              'https://res.cloudinary.com/detetmaw8/image/upload/v1757921861/forum-gamatika/otbxpefnhnflbthutosi.png'
            }
            alt={comment?.author.name || 'User'}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md"
          />
          {isCurrentUser && (
            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-gray-800">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="ml-3 flex-1">
          {/* Header komentar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h4
                className={cn(
                  'font-semibold text-gray-800 dark:text-white',
                  isCurrentUser && 'text-blue-600 dark:text-blue-400'
                )}
              >
                {comment?.author.username}
              </h4>
              {isCurrentUser && (
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                  Anda
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDateTime(comment?.created_at)}
            </span>
          </div>

          {/* Konten komentar */}
          <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
            {comment?.content}
          </p>

          {/* Gambar komentar */}
          {comment?.image && (
            <div
              className="mt-3 inline-block rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleImageClick(comment.image)}
            >
              <Image
                src={comment.image}
                alt={`Comment image`}
                width={100}
                height={100}
                className="object-cover w-60 h-40"
              />
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
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;

    setIsUploading(true);
    try {
      let imageUrl = null;

      // Upload image jika ada
      if (image) {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: {
              base64: image.base64,
              name: image.file.name,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        imageUrl = data.image.url;
        console.log('data: ', data);
      }

      // Kirim komentar
      onAddComment({
        content,
        image: imageUrl,
      });

      // Reset form
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Gagal mengupload gambar: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        setImage({
          id: Date.now(),
          file,
          base64: event.target.result,
          url: URL.createObjectURL(file),
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex space-x-3">
        {/* Input area */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Tulis komentar Anda..."
          />

          {/* Preview gambar */}
          {image && (
            <div className="mt-3 relative">
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <img
                  src={image.url}
                  alt={`Preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
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
          )}

          {/* Tombol aksi */}
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-2">
              {!image && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImageClick}
                  className="text-gray-500 hover:text-blue-500"
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
                </Button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!content.trim() && !image}
              className={cn(
                'px-4 py-2 rounded-full font-medium',
                content.trim() || image
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              )}
            >
              {isUploading ? 'Mengirim...' : 'Komentar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
