'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Comment, CommentInput } from './Comment';
import { ImageModal } from './ImageUpload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast from 'react-hot-toast';
import { formatDateTime } from '@/lib/utils';
import { categories } from '@/data/mockForum';
import Link from 'next/link';

export function ForumPost({
  post,
  onLike,
  onShare,
  comments,
  onAddComment,
  className,
  isAuth,
}) {
  const [showComments, setShowComments] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (newComment) => {
    onAddComment(post?.id, newComment);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  return (
    <Card className={`${className} mb-4 transition-colors duration-300`}>
      <CardHeader className="pb-4">
        <div className="flex items-start">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src="https://res.cloudinary.com/detetmaw8/image/upload/v1757921861/forum-gamatika/otbxpefnhnflbthutosi.png"
              alt={post?.author.name}
            />
            <AvatarFallback>{post?.author.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex-1">
            <div className="flex items-start flex-col text-sm text-gray-600 dark:text-gray-300">
              <span>{post?.author.username}</span>
              <span>{formatDateTime(post?.created_at)}</span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
          >
            {post?.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p
          className={`text-gray-700 dark:text-gray-300 mb-4 ${
            post?.images.length > 0 ? '' : 'text-2xl py-8'
          }`}
        >
          {post?.content}
        </p>
        {post?.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mb-4 rounded-2xl">
            {post?.images.map((image, index) => (
              <div
                key={index}
                className="aspect-square dark:border-gray-600 cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  alt={`Post image ${index + 1}`}
                  src={image}
                  width={500}
                  height={500}
                  className="object-contain border"
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => onLike(post?.id)}
              className={`flex items-center space-x-1 ${
                post?.liked
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              } transition-colors`}
            >
              <svg
                className="w-5 h-5"
                fill={post?.liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{post?.like_count}</span>
            </button>
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post?.comment_count}</span>
            </button>
            <button
              onClick={() => onShare(post?.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 010-5.368m-9.032 5.368a9.001 9.001 0 01-5.368-9.032m9.032 9.032a9.001 9.001 0 015.368-9.032"
                />
              </svg>
              <span>{post?.share_count}</span>
            </button>
          </div>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>
        </div>
        {showComments && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Komentar ({post?.comment_count})
              </h4>
              <button
                onClick={handleCommentClick}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
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
            <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md">
              {comments.map((comment, i) => (
                <Comment key={i} comment={comment} />
              ))}
              {isAuth ? (
                <CommentInput onAddComment={handleAddComment} />
              ) : (
                <Link className="" href={`/login`}>
                  <p className="text-[10px] text-center text-red-400">
                    jika ingin komen login terlebih dahulu{' '}
                  </p>
                </Link>
              )}
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <ImageModal
        image={selectedImage}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
      />
    </Card>
  );
}

export function CreatePostButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300 font-medium"
    >
      <svg
        className="w-5 h-5 mr-2"
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
      Buat Postingan
    </button>
  );
}

export default function CreatePostModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Kalkulus');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }
    setIsSubmitting(true);
    try {
      // Upload images to Cloudinary
      let uploadedImages = [];
      if (images.length > 0) {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: images.map((img) => ({
              base64: img.base64,
              name: img.file.name,
            })),
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }
        const data = await response.json();
        uploadedImages = data.images;
      }
      // Format data postingan
      const postData = {
        title,
        content,
        category,
        images: uploadedImages.map((img) => ({
          url: img.url,
          public_id: img.public_id,
        })),
      };
      // Panggil fungsi onCreate dari parent component
      await onCreate(postData);
      // Reset form
      setTitle('');
      setContent('');
      setCategory('Kalkulus');
      setImages([]);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Gagal membuat postingan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-gray-800 w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
            Buat Postingan Baru
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Judul
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul postingan"
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Kategori
            </label>
            <Select
              value={category}
              onValueChange={setCategory}
              defaultValue="Kalkulus"
            >
              <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Konten
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis konten diskusi Anda..."
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-2">
            <ImageUpload images={images} setImages={setImages} maxImages={4} />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Membuat...' : 'Posting'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function ImageUpload({ images, setImages, maxImages = 4 }) {
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Convert files to base64 and add to state
      const newImages = files.map((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise((resolve) => {
          reader.onload = () => {
            resolve({
              id: Date.now() + index,
              file: file,
              base64: reader.result,
              url: URL.createObjectURL(file), // Temporary URL for preview
            });
          };
        });
      });

      Promise.all(newImages).then((results) => {
        setImages((prev) => [...prev, ...results]);
      });
    }
  };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <div className="mb-2">
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
                width={40}
                height={40}
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
            />
            <div className="text-center">
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
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
