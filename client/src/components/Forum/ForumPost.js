'use client';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Comment, CommentInput } from './Comment';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Share2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { MessageCircle, LogIn } from 'lucide-react';
import { formatReadableTime } from '@/lib/timeReadable';
import { categories } from '@/data/mockCategories';
import Link from 'next/link';
import { ImageModal } from './ImageUpload';
import { getPostCommentPerPage } from '@/data/getPostsData';
import { createComment } from '@/lib/action';

const CommentSkeleton = () => {
  return (
    <div className="flex space-x-3 mb-4 animate-pulse">
      <div className="shrink-0">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export function ForumPost({ post, onLike, className, isAuth, user, token }) {
  const [showComments, setShowComments] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limitComment = 10;
  const [showAllTextContent, setShowAllTextContent] = useState(false);

  const commentsContainerRef = useRef(null);
  const observer = useRef();
  const lastCommentElementRef = useCallback(
    (node) => {
      if (loadingMore || !hasMore || !showComments) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && showComments) {
          loadMoreComments();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, showComments]
  );

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowImageModal(true);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setComments([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  };

  useEffect(() => {
    if (showComments) {
      handleFetchComment();
    }
  }, [showComments]);

  const handleAddComment = async (newCommentObject) => {
    try {
      const resp = await createComment(post.id, token, newCommentObject);
      if (!resp.success) {
        toast.error(resp.errors[0].message);
        return;
      }

      const newCommentData = resp.data;

      setComments((prev) => [...prev, newCommentData]);

      post.comment_count = (post.comment_count || 0) + 1;

      toast.success('Komentar berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan komentar');
    }
  };

  const handleDeleteComment = useCallback(
    (commentId) => {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      post.comment_count = Math.max(0, (post.comment_count || 0) - 1);
    },
    [post]
  );

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? (post?.images.length || 0) - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === (post?.images.length || 0) - 1 ? 0 : prevIndex + 1
    );
  };

  const handleShare = (id) => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.title?.substring(0, 20) + '...',
        url: `${window.location.origin}/forum/${id}`,
      });
    } else {
      alert('Link disalin ke clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFetchComment = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const resp = await getPostCommentPerPage(
        post.id,
        currentPage,
        limitComment
      );

      if (!resp.success) {
        toast.error(resp.message);
        if (!isLoadMore) {
          setComments([]);
        }
        setHasMore(false);
        return;
      }

      const validComments = resp.data.filter(
        (comment) => comment && comment.author && comment.author.username
      );

      if (validComments.length < limitComment) {
        setHasMore(false);
      }

      if (isLoadMore) {
        setComments((prev) => [...prev, ...validComments]);
      } else {
        setComments(validComments);
      }
    } catch (error) {
      toast.error(error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreComments = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const resp = await getPostCommentPerPage(post.id, nextPage, limitComment);

      if (!resp.success) {
        toast.error(resp.message);
        setHasMore(false);
        return;
      }

      const validComments = resp.data.filter(
        (comment) => comment && comment.author && comment.author.username
      );

      if (validComments.length < limitComment) {
        setHasMore(false);
      }

      setComments((prev) => [...prev, ...validComments]);
      setCurrentPage(nextPage);
    } catch (error) {
      toast.error(error.message);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loadingMore, post.id, limitComment]);

  return (
    <>
      <Card className={`${className} mb-4 transition-colors duration-300`}>
        <CardHeader className="pb-4">
          <div className="flex items-start">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={post?.author?.avatar || null}
                alt={post?.author?.username || null}
              />
              <AvatarFallback>
                {post?.author?.username?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2 flex-1">
              <div className="flex items-start flex-col text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">
                  {post?.author?.username || 'Pengguna Tidak Diketahui'}
                </span>
                <span className="text-xs">
                  {formatReadableTime(post?.created_at)}
                </span>
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
              post?.images.length > 0 ? '' : 'text-lg'
            }`}
          >
            {showAllTextContent ? (
              <>
                {post.content}
                <span
                  onClick={() => setShowAllTextContent(false)}
                  className="cursor-pointer"
                >
                  {' '}
                  ⬆️
                </span>
              </>
            ) : (
              <span>
                {post?.content.length < 250 ? (
                  post.content
                ) : (
                  <span>
                    {post.content.slice(0, 250)}{' '}
                    <span
                      onClick={() => setShowAllTextContent(true)}
                      className="cursor-pointer"
                    >
                      {'... '}
                      ⬇️
                    </span>
                  </span>
                )}
              </span>
            )}
          </p>

          {post?.images && post?.images.length > 0 && (
            <div className="mb-4 rounded-2xl">
              <div className="relative group">
                <div
                  className="relative lg:w-[70%] max-h-fit h-full max-w-fit overflow-hidden mx-auto border-[1px] border-gray-800 dark:border-gray-400 rounded-sm dark:shadow-sm"
                  onClick={() =>
                    handleImageClick(
                      post?.images[selectedImageIndex] || post?.images[0]
                    )
                  }
                >
                  <Image
                    alt={`Post image ${selectedImageIndex + 1}`}
                    src={post?.images[selectedImageIndex] || post?.images[0]}
                    width={800}
                    height={700}
                    className="object-contain"
                    unoptimized
                  />
                </div>

                {/* Navigation buttons */}
                {post?.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 dark:bg-card dark:text-whiter"
                      onClick={handlePrevImage}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 dark:bg-card dark:text-white"
                      onClick={handleNextImage}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={isAuth ? false : true}
                onClick={() => onLike(post?.id)}
                className={`flex items-center space-x-1 ${
                  post?.liked
                    ? 'text-red-500'
                    : 'text-gray-500 hover:text-red-500'
                }`}
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
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCommentClick}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
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
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(post.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
              >
                <Share2 />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
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
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </Button>
          </div>

          {showComments && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  Komentar ({post?.comment_count})
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
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
                </Button>
              </div>
              <ScrollArea
                ref={commentsContainerRef}
                className={`w-full rounded-md relative dark:border-gray-700 md:p-4 p-1 h-[calc(100vh)] overflow-y-scroll`}
              >
                {loading && !comments.length ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <CommentSkeleton key={index} />
                  ))
                ) : (
                  <>
                    {comments.map((comment, i) => {
                      if (comments.length === i + 1) {
                        return (
                          <div ref={lastCommentElementRef} key={comment.id}>
                            <Comment
                              comment={comment}
                              user={user}
                              token={token}
                              onDeleteComment={handleDeleteComment}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <Comment
                            key={comment.id}
                            comment={comment}
                            user={user}
                            token={token}
                            onDeleteComment={handleDeleteComment}
                          />
                        );
                      }
                    })}

                    {loadingMore &&
                      Array.from({ length: 2 }).map((_, index) => (
                        <CommentSkeleton key={`loading-${index}`} />
                      ))}
                  </>
                )}

                {isAuth ? (
                  <CommentInput onAddComment={handleAddComment} />
                ) : (
                  <CommentAuthPrompt />
                )}
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      <ImageModal
        image={selectedImage}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
      />
    </>
  );
}

export function CreatePostButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300 font-medium"
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
    </Button>
  );
}

export default function CreatePostModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Matematika');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error('Konfigurasi upload error. Hubungi admin.');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImages = [];

      if (images.length > 0) {
        const uploadPromises = images.map(async (image) => {
          if (!image.file) {
            return null;
          }

          const formData = new FormData();
          formData.append('file', image.file);
          formData.append('upload_preset', UPLOAD_PRESET);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!response.ok) {
            const err = await response.json();
            toast.error(`Cloudinary upload failed: ${err.error.message}`);
          }

          const data = await response.json();
          return {
            url: data.secure_url,
            public_id: data.public_id,
          };
        });

        const results = await Promise.all(uploadPromises);
        uploadedImages = results.filter((img) => img !== null);
      }

      const postData = {
        title,
        content,
        category,
        images: uploadedImages,
      };

      await onCreate(postData);

      setTitle('');
      setContent('');
      setCategory('Matematika');
      setImages([]);
      onClose();
      toast.success('Postingan berhasil dibuat!');
    } catch (error) {
      toast.error(`Gagal: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-gray-800 w-[80%] max-w-2xl md:h-[95vh] h-[70vh] overflow-y-auto">
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
              defaultValue="Matematika"
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
              className="dark:bg-gray-700 dark:text-white min-h-[120px]"
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
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        toast.error(`Maksimal ${maxImages} gambar yang diperbolehkan`);
        return;
      }

      const files = Array.from(e.target.files);

      const filesToProcess = files.slice(0, remainingSlots);

      const newImages = filesToProcess.map((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise((resolve) => {
          reader.onload = () => {
            resolve({
              id: Date.now() + index,
              file: file,
              base64: reader.result,
              url: URL.createObjectURL(file),
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
        Gambar ({images.length}/{maxImages})
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {images?.map((image, id) => (
          <div key={id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <Image
                src={image?.url}
                alt="Uploaded"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              onClick={() => removeImage(image.id)}
              variant="ghost"
              size="sm"
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
            </Button>
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
              disabled={images.length >= maxImages}
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
                <p className="text-xs text-gray-400 mt-1">
                  {maxImages - images.length} slot tersisa
                </p>
              </>
            </div>
          </label>
        )}
      </div>
      {images.length >= maxImages && (
        <p className="text-sm text-red-500 mt-1">
          Maksimal {maxImages} gambar telah tercapai. Hapus gambar yang ada
          untuk menambahkan yang baru.
        </p>
      )}
    </div>
  );
}

export const CommentAuthPrompt = () => {
  return (
    <Card className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/50">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-md opacity-70"></div>
            <div className="relative p-3 rounded-full bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
          Login untuk Berkomentar
        </CardTitle>

        <CardDescription className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Dengan login, Anda juga akan mendapatkan akses ke fitur eksklusif
          lainnya
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          asChild
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            Login Sekarang
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
