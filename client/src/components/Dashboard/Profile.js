'use client';
import { useState, useEffect, use } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deletePost, updatePost, updateUser } from '@/lib/action';
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
import { Button } from '../ui/button';
import {
  EditCommenttModal,
  EditPostModal,
  PostDetailModal,
  PrivateKeyModal,
} from '../Profile/PostModalProfile';
import { conGetNFTByOwner } from '@/nft/action';
import { Lock } from 'lucide-react';
import { ProfileSkeletonComp } from '../skeleton/ProfileSkeleton';
import AchievementSection from '../Profile/Achievement';
import { formatReadableTime } from '../Forum/ForumPost';

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

  useEffect(() => {
    fetchAchievements();
    fetchUserNFTs();
  }, []);

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
    try {
      const resp = await conGetNFTByOwner(user?.wallet_address);
      setNfts(resp);
    } catch (error) {
      console.log(error);
    }
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
    ];
    setAchievements(mockAchievements);
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      const resp = await updateUser(token, editData);
      if (!resp.success) {
        toast.error(resp?.errors[0].message);
        return;
      }
      toast.success(resp.message);
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.message);
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
      if (!resp.success) {
        toast.error(resp.errors[0].message);
        return;
      }
      toast.success(resp.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      setEditingPost(null);
      const isYes = confirm('Delete post!');
      if (isYes) {
        const resp = await deletePost(token, id);
        if (!resp.success) {
          toast.error(resp.message);
          return;
        }
        toast.success(resp.message);
      }
    } catch (error) {
      toast.error(error.message);
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

  if (!user) {
    return ProfileSkeletonComp();
  }

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
            <div className="md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user?.full_name}
              </h1>
              <p className="text-muted-foreground mt-1">@{user?.username}</p>
              <p className="text-muted-foreground mt-1 text-[13px] ">
                {user?.prodi}
              </p>
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
              <p className="text-sm text-muted-foreground">Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="text-[10px] md:text-[11px] font-mono bg-gray-100 p-1 dark:bg-gray-800 rounded truncate">
                  {user?.wallet_address}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(user?.wallet_address || '');
                    toast.success('Wallet Address copied!');
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
                          <p className="text-sm text-muted-foreground mb-2 dark:text-gray-400">
                            {formatReadableTime(post.created_at)}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
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

        <TabsContent value="achievements" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-xl sm:text-2xl">
                    Koleksi NFT
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base max-w-2xl">
                    NFT yang Anda dapatkan dari berkontribusi
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="self-start sm:self-auto text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
                >
                  {nfts.length} NFT
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {nfts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                  {nfts.map((nft, i) => (
                    <Card
                      key={i}
                      className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
                    >
                      <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                            <Image
                              src={`${
                                process.env.NEXT_PUBLIC_IPFS_GATEWAY
                              }${nft.image.slice(7)}`}
                              alt={nft.name}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              priority={i < 3}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                              {nft.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {nft.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center text-muted-foreground px-4">
                  <div className="mb-3 sm:mb-4 text-4xl sm:text-5xl">🏆</div>
                  <h3 className="text-lg sm:text-xl font-medium mb-1">
                    Belum ada NFT
                  </h3>
                  <p className="max-w-xs sm:max-w-md text-sm sm:text-base">
                    Lanjutkan berkontribusi untuk mendapatkan NFT!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Penghargaan */}
          <AchievementSection user={user} />
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

      {viewingPost && (
        <PostDetailModal
          post={viewingPost}
          onClose={() => setViewingPost(null)}
          token={token}
          user={user}
          onCommentAdded={(postId, newComment) => {
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
