'use client';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  createComment,
  deletePost,
  updatePost,
  updateUser,
} from '@/lib/action';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { getPrivateKey } from '@/data/getPrivateKey';
import { CommentInput } from '../Forum/Comment';

// Fungsi untuk membuat placeholder SVG
const createPlaceholderSVG = (text, width = 150, height = 150) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
};

// Modal untuk edit postingan dengan Shadcn UI
const EditPostModal = ({ post, onDeletePost, onSave, onClose }) => {
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

// Modal untuk detail postingan dengan Shadcn UI yang lebih baik
const PostDetailModal = ({ post, onClose, token, onCommentAdded }) => {
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

  const handleAddComment = async (commentData) => {
    try {
      const resp = await createComment(post.id, token, commentData);
      if (resp?.error) {
        toast.error(resp.error);
        return;
      }

      setComments((prev) => [resp, ...prev]);
      setNewComment('');

      if (onCommentAdded) {
        onCommentAdded(post.id, resp);
      }
    } catch (error) {
      toast.error(error.message || 'Gagal menambahkan komentar');
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
                      {formatDateTime(post?.created_at)}
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
                    src={post.images[currentImageIndex]}
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

            <div ref={commentsStartRef} />

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
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">
                              {comment?.author?.username}
                            </p>
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(comment?.created_at)}
                            </span>
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

const PrivateKeyModal = ({ isOpen, onClose, onVerify, token }) => {
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      const resp = await getPrivateKey(token, password);
      if (resp?.error) {
        toast.error(resp.error);
      }
      setPrivateKey(resp.private_key);
      onVerify(true);
    } catch (err) {
      console.error(err);
      setError('Password salah. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(privateKey);
    toast.success('Private key telah disalin ke clipboard');
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

export default function ProfilePageComp({ user, token }) {
  const [nfts, setNfts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [privateKeyVerified, setPrivateKeyVerified] = useState(false);
  const postsPerPage = 6;
  const route = useRouter();

  // Leveling System
  const calculateLevel = () => {
    const totalContributions =
      userStats.totalPosts + userStats.totalComments + userStats.totalLikes;
    if (totalContributions >= 100) return { level: 'Expert', progress: 100 };
    if (totalContributions >= 50)
      return { level: 'Advanced', progress: (totalContributions / 100) * 100 };
    if (totalContributions >= 20)
      return {
        level: 'Intermediate',
        progress: (totalContributions / 50) * 100,
      };
    return { level: 'Beginner', progress: (totalContributions / 20) * 100 };
  };

  const userStats = {
    totalPosts: user?.posts?.length || 0,
    totalComments:
      user?.posts?.reduce((sum, post) => sum + post.comment_count, 0) || 0,
    totalLikes:
      user?.posts?.reduce((sum, post) => sum + post.like_count, 0) || 0,
    totalShares:
      user?.posts?.reduce((sum, post) => sum + post.share_count, 0) || 0,
    badges: 0,
  };

  const levelInfo = calculateLevel();
  const leaderboardPosition = 7;

  const activityTimeline = [
    {
      id: 1,
      type: 'post',
      title: `Membuat postingan "${
        user?.posts?.[0]?.title || 'Postingan Baru'
      }"`,
      time: formatDateTime(user?.posts?.[0]?.created_at || new Date()),
      icon: '📝',
    },
    {
      id: 2,
      type: 'comment',
      title: `Komentar di postingan "${
        user?.posts?.[1]?.title || 'Postingan Lain'
      }"`,
      time: formatDateTime(
        user?.posts?.[1]?.created_at || new Date(Date.now() - 86400000)
      ),
      icon: '💬',
    },
    {
      id: 3,
      type: 'solve',
      title: 'Selesaikan soal Integral Tak Tentu',
      time: formatDateTime(new Date(Date.now() - 172800000)),
      icon: '✅',
    },
    {
      id: 4,
      type: 'like',
      title: 'Memberi like pada 5 postingan',
      time: formatDateTime(new Date(Date.now() - 259200000)),
      icon: '❤️',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Buat postingan baru',
      icon: '✍️',
      action: () => route.push('/dashboard/forum'),
    },
    {
      id: 2,
      title: 'Lihat Private Key',
      icon: '🔑',
      action: () => setShowPrivateKeyModal(true),
    },
  ];

  const fetchUserNFTs = async () => {
    const mockNFTs = [
      {
        id: 'nft-1',
        name: 'Top Contributor',
        description: 'Diterima untuk 50+ kontribusi',
        image: createPlaceholderSVG('NFT 1'),
        earnedAt: new Date().toISOString(),
        rarity: 'Rare',
      },
      {
        id: 'nft-2',
        name: 'Problem Solver',
        description: 'Diterima untuk menyelesaikan 100+ soal',
        image: createPlaceholderSVG('NFT 2'),
        earnedAt: new Date().toISOString(),
        rarity: 'Legendary',
      },
    ];
    setNfts(mockNFTs);
  };

  const fetchAchievements = async () => {
    const mockAchievements = [
      {
        id: 1,
        name: 'Top Contributor',
        icon: '🏆',
        earned: true,
        rarity: 'Rare',
      },
      {
        id: 2,
        name: 'Problem Solver',
        icon: '🎯',
        earned: true,
        rarity: 'Legendary',
      },
      {
        id: 3,
        name: 'Excellent Rating',
        icon: '⭐',
        earned: true,
        rarity: 'Common',
      },
      {
        id: 4,
        name: 'Quick Learner',
        icon: '🚀',
        earned: false,
        rarity: 'Epic',
      },
    ];
    setAchievements(mockAchievements);
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      const resp = await updateUser(token, editData);
      if (resp?.error != undefined) {
        toast.error(resp.error);
      }
      toast.success('Username berhasil diperbarui');
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleViewPost = (post) => {
    setViewingPost(post);
  };

  const handleSavePost = async (updatedPost) => {
    try {
      setEditingPost(null);
      const resp = await updatePost(token, updatedPost);
      if (resp != null) {
        toast.error(resp);
      }
      toast.success('Postingan berhasil diperbarui!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      setEditingPost(null);
      const resp = await deletePost(token, id);
      if (resp?.error) {
        toast.error(resp.error);
      }
      toast.success(resp.message);
    } catch (error) {
      console.error(error);
    }
  };

  const sortedPosts = user?.posts
    ? [...user.posts].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
    : [];
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handlePrivateKeyVerify = (verified) => {
    setPrivateKeyVerified(verified);
  };

  useEffect(() => {
    fetchAchievements();
    fetchUserNFTs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src="https://res.cloudinary.com/detetmaw8/image/upload/v1757921861/forum-gamatika/otbxpefnhnflbthutosi.png"
                  alt={user.full_name}
                />
                <AvatarFallback>
                  {(user?.full_name || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                onClick={handleEditProfile}
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user?.full_name}
              </h1>
              <p className="text-muted-foreground mt-1">@{user?.username}</p>
              <p className="text-muted-foreground mt-1">{user?.prodi}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="destructive">Level {levelInfo.level}</Badge>
                <Badge variant="outline">
                  #{leaderboardPosition} Top Contributor
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NIM</p>
              <p className="font-medium">{user?.nim}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Postingan</p>
              <p className="font-medium">{userStats.totalPosts}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Public Key</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-gray-100 p-1 dark:bg-gray-800 rounded truncate">
                  {user?.public_key}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    navigator.clipboard.writeText(user?.public_key || '')
                  }
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
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              onClick={action.action}
              className="flex items-center gap-2"
            >
              <span>{action.icon}</span>
              <span>{action.title}</span>
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="relative w-full overflow-x-auto scrollbar-hide">
          <TabsList className="flex w-max space-x-2 p-1">
            <TabsTrigger value="overview" className="whitespace-nowrap">
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="whitespace-nowrap">
              Activity
            </TabsTrigger>
            <TabsTrigger value="achievements" className="whitespace-nowrap">
              Achievements
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Postingan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
                {currentPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewPost(post)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{post.title}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPost(post);
                              }}
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
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {formatDateTime(post.created_at)}
                          </p>
                          <p className="text-gray-700 mt-1 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Badge variant="secondary">{post.category}</Badge>
                            <span className="text-muted-foreground">
                              💬 {post?.comment_count || 0}
                            </span>
                            <span className="text-muted-foreground">
                              ❤️ {post?.like_count || 0}
                            </span>
                            <span className="text-muted-foreground">
                              👁️ {post?.share_count || 0}
                            </span>
                          </div>
                        </div>
                        {post.images && post.images.length > 0 && (
                          <div className="ml-4 hidden md:block">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border">
                              <Image
                                src={post.images[0]}
                                alt={post.title}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {currentPosts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada postingan
                  </div>
                )}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2 overflow-x-auto py-2">
                  <Button
                    variant="outline"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="flex-shrink-0 px-3 py-2"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex space-x-1 overflow-x-auto py-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 3) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 2 + i;
                      } else {
                        page = currentPage - 1 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(page)}
                          className="flex-shrink-0 w-10 h-10 min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Tombol Next */}
                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex-shrink-0 px-3 py-2"
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Kontribusi</CardTitle>
              <CardDescription>
                Aktivitas terkait Anda di platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityTimeline.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* NFT Collection */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Koleksi NFT</CardTitle>
                <Badge variant="secondary">{nfts.length} NFT</Badge>
              </div>
              <CardDescription>
                NFT yang Anda dapatkan dari berkontribusi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nfts.map((nft) => (
                  <Card key={nft.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: nft.image }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{nft.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {nft.description}
                          </p>
                          <Badge
                            variant={
                              nft.rarity === 'Legendary'
                                ? 'default'
                                : 'secondary'
                            }
                            className="mt-2"
                          >
                            {nft.rarity}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {nfts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada NFT. Lanjutkan berkontribusi untuk mendapatkan
                    NFT!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Penghargaan</CardTitle>
              <CardDescription>Penghargaan yang Anda dapatkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`flex flex-col items-center p-4 ${
                      achievement.earned ? 'border-primary' : 'opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <p className="text-sm font-medium text-center">
                      {achievement.name}
                    </p>
                    <Badge
                      variant={
                        achievement.rarity === 'Legendary'
                          ? 'default'
                          : 'secondary'
                      }
                      className="mt-2"
                    >
                      {achievement.rarity}
                    </Badge>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md w-[90%]">
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                value={editData.username || ''}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    username: e.target.value,
                    id: user.id,
                  })
                }
                placeholder="Masukkan username baru"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveProfile}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onDeletePost={handleDeletePost}
          onSave={handleSavePost}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* Post Detail Modal */}
      {viewingPost && (
        <PostDetailModal
          post={viewingPost}
          onClose={() => setViewingPost(null)}
          token={token}
          onCommentAdded={(postId, newComment) => {
            // Update komentar di postingan yang sedang dilihat
            setViewingPost((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                comments: [newComment, ...(prev.comments || [])],
              };
            });
          }}
        />
      )}

      {/* Private Key Modal */}
      <PrivateKeyModal
        isOpen={showPrivateKeyModal}
        onClose={() => {
          setShowPrivateKeyModal(false);
          setPrivateKeyVerified(false);
        }}
        token={token}
        onVerify={handlePrivateKeyVerify}
      />
    </div>
  );
}
