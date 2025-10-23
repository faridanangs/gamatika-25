'use client';
import { useState, useRef } from 'react';
import { ImageModal } from './ImageUpload';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { deleteComment } from '@/lib/action';
import { formatReadableTime } from './ForumPost';

export function Comment({ comment, user, token }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleDeleteComment = async () => {
    try {
      const isYes = confirm('Delete Comment!');
      if (!isYes) return;

      const resp = await deleteComment(token, comment.id);
      if (!resp.success) {
        toast.error(resp.message);
        return;
      }

      toast.success(resp.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={cn(
        'mb-4 pb-4 border-b border-gray-200 dark:border-gray-600 last:border-0 transition-all duration-300'
      )}
    >
      <div className="flex items-start">
        <div className="relative hidden md:inline-block">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={comment?.author.avatar}
              alt={comment?.author.username}
            />
            <AvatarFallback>
              {comment?.author.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {user?.id === comment?.author.id && (
            <Badge className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-gray-800 p-0">
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
            </Badge>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <div className="flex mb-1 flex-col ml-4">
              <div className="flex gap-2">
                <h4
                  className={cn('font-semibold text-gray-800 dark:text-white')}
                >
                  {comment?.author.username}
                </h4>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatReadableTime(comment?.created_at)}
              </span>
            </div>
            {user?.id === comment.author.id && (
              <Button
                size="sm"
                onClick={handleDeleteComment}
                className="hover:bg-transparent bg-transparent hover:text-[16px] duration-900 transition-all hover:cursor-pointer p-0"
              >
                🗑️
              </Button>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {comment?.content}
          </p>
          {comment?.image && (
            <div
              className="mt-3 inline-block rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleImageClick(comment.image)}
            >
              <Image
                src={comment.image}
                alt={`Comment image ${comment.id}`}
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

export function CommentInput({ onAddComment, className }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;

    setIsUploading(true);
    try {
      let imageUrl = null;

      if (image && content != '') {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT_API_URL}api/upload`,
          {
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
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          return toast.error(errorData?.error || 'Upload failed');
        }

        const data = await response.json();
        imageUrl = data.image.url;
      }

      onAddComment({
        content,
        image: imageUrl,
      });

      setContent('');
      setImage(null);
    } catch (error) {
      alert(`upload image failed: ${error?.message}`);
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
    <div
      className={` dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${className} border-2 sticky bottom-0 z-10`}
    >
      <div className="flex space-x-3 ">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            required={true}
            minLength={10}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Tulis komentar Anda..."
          />

          {image && (
            <div className="mt-3 relative">
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <img
                  src={image.url}
                  alt={`Preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                onClick={removeImage}
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 w-6 h-6"
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
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center my-2">
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
                'px-4 py-2 rounded-full font-medium inline-block',
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
