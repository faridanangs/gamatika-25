'use client';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { CommentInput } from '../Forum/Comment';
import { getPrivateKey } from '@/data/getPrivateKey';
import { createComment, deleteComment } from '@/lib/action';
import { formatReadableTime } from '../Forum/ForumPost';

export const EditPostModal = ({ post, onDeletePost, onSave, onClose }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleSave = () => {
    onSave({
      id: post.id,
      title,
      content,
    });
  };

  const handleDelete = () => {
    onDeletePost(post.id);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Postingan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul postingan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konten</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Masukkan konten postingan"
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PostDetailModal = ({
  post,
  onClose,
  token,
  onCommentAdded,
  user,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const commentsStartRef = useRef(null);

  useEffect(() => {
    commentsStartRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddComment = async (newComment) => {
    try {
      const resp = await createComment(post.id, token, newComment);
      if (!resp.success) {
        toast.error(resp.errors[0].message);
        return;
      }
      setComments((prev) => [...prev, resp.data]);
      setNewComment('');

      if (onCommentAdded) {
        onCommentAdded(post.id, resp.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      const isYes = confirm('Delete Comment!');
      if (!isYes) return;

      const commentToDelete = comments.find((c) => c.id === id);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );

      const resp = await deleteComment(token, id);
      if (!resp.success) {
        setComments((prevComments) => [...prevComments, commentToDelete]);
        toast.error(resp.message);
        return;
      }

      toast.success(resp.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">{post.title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={post.author?.avatar}
                  alt={post.author?.username}
                />
                <AvatarFallback>{post?.author?.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{post?.author?.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatReadableTime(post?.created_at)}
                    </p>
                  </div>
                  <Badge variant="secondary">{post?.category}</Badge>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {post?.content}
              </p>
            </div>

            {post?.images && post.images.length > 0 && (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border">
                  <Image
                    src={post.images[currentImageIndex] || post.images[0]}
                    alt={`Gambar ${currentImageIndex + 1}`}
                    width={800}
                    height={600}
                    className="w-full object-contain"
                  />
                  {post.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
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
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
                <div className="flex justify-center space-x-1">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex
                          ? 'bg-primary'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Komentar ({comments.length})</h4>
              </div>

              <div className="space-y-4 mb-20">
                {comments.map((comment, i) => (
                  <Card
                    key={comment.id || i}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10 hidden md:inline-block">
                          <AvatarImage
                            src={comment?.author?.avatar}
                            alt={comment?.author?.username}
                          />
                          <AvatarFallback>
                            {comment?.author?.username?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div className="flex mb-1 flex-col">
                              <p className="font-medium">
                                {comment?.author?.username}
                              </p>
                              <span className="text-sm text-muted-foreground">
                                {formatReadableTime(comment?.created_at)}
                              </span>
                            </div>
                            {user.id === comment.author.id && (
                              <Button
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
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
                              className="rounded-lg overflow-hidden border cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => handleImageClick(comment.image)}
                            >
                              <Image
                                src={comment.image}
                                alt={`Comment image`}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <div ref={commentsStartRef} />
                  </Card>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada komentar. Jadilah yang pertama berkomentar!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Input komentar tetap di bagian bawah */}
        <div className="flex-shrink-0 border-t p-4 bg-background">
          <CommentInput onAddComment={handleAddComment} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PrivateKeyModal = ({ isOpen, onClose, onVerify, token }) => {
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      const resp = await getPrivateKey(token, password);
      if (!resp.success) {
        toast.error(resp.errors[0].message);
        setIsLoading(false);
        return;
      }
      setPrivateKey(resp.data.private_key);
      onVerify(true);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(privateKey);
    toast.success('Private key copied!');
    setPrivateKey('');
    onClose(true);
    setPassword('');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[90%] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Lihat Private Key</DialogTitle>
        </DialogHeader>
        {privateKey ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 mb-2 dark:text-white">
                Private Key Anda:
              </p>
              <div className="flex items-center justify-between gap-1">
                <code className="text-sm font-mono dark:bg-gray-800 bg-white p-2 rounded border break-all">
                  {privateKey}
                </code>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
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
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </Button>
              </div>
            </div>
            <p className="text-xs text-red-400">
              *Simpan private key dengan aman. Jangan berikan kepada siapa pun.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Masukkan Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button onClick={handleVerify} disabled={isLoading || !password}>
                {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
