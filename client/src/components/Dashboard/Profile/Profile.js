'use client';
import { useState, useEffect, use } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  deleteArtikel,
  deletePost,
  updatePost,
  updateUser,
} from '@/lib/action';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { EditPostModal, PrivateKeyModal } from './PostModalProfile';
import { conGetNFTByOwner } from '@/nft/action';
import { ProfileSkeletonComp } from '../../skeleton/ProfileSkeleton';
import AchievementSection from './Achievement';

import { ArtikelCard, PostCard } from './ArtikelAndPostCard';
import { getUserArtikel, getUserPost } from '@/data/getUserData';

export default function ProfilePageComp({ user, token }) {
  const [nfts, setNfts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [editingPost, setEditingPost] = useState(null);

  // State untuk menyimpan posts dan artikels dari server
  const [posts, setPosts] = useState([]);
  const [artikels, setArtikels] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingArtikels, setLoadingArtikels] = useState(false);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalArtikelsCount, setTotalArtikelsCount] = useState(0);

  // Pagination states for posts
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const postsPerPage = 6;

  // Pagination states for artikels
  const [currentArtikelPage, setCurrentArtikelPage] = useState(1);
  const artikelsPerPage = 6;

  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [privateKeyVerified, setPrivateKeyVerified] = useState(false);
  const route = useRouter();

  useEffect(() => {
    fetchAchievements();
    fetchUserNFTs();
    handleFetchArtikel();
    handleFetchPost();
  }, []);

  useEffect(() => {
    if (activeTab === 'posts') {
      handleFetchPost();
    }
  }, [currentPostPage, activeTab]);

  useEffect(() => {
    if (activeTab === 'artikels') {
      handleFetchArtikel();
    }
  }, [currentArtikelPage, activeTab]);

  const calculateLevel = () => {
    const totalContributions =
      userStats.totalPosts +
      userStats.totalComments +
      userStats.totalLikes +
      userStats.totalArtikels;
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
    totalPosts: totalPostsCount || 0,
    totalArtikels: totalArtikelsCount || 0,
    totalComments:
      posts?.reduce((sum, post) => sum + post.comment_count, 0) || 0,
    totalLikes: posts?.reduce((sum, post) => sum + post.like_count, 0) || 0,
    totalShares: posts?.reduce((sum, post) => sum + post.share_count, 0) || 0,
    badges: 0,
  };

  const levelInfo = calculateLevel();

  const quickActions = [
    {
      id: 1,
      title: 'Buat postingan baru',
      icon: '✍️',
      action: () => route.push('/dashboard/forum'),
    },
    {
      id: 2,
      title: 'Buat Artikel baru',
      icon: '📰',
      action: () => route.push('/dashboard/artikel'),
    },
    {
      id: 3,
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
      toast.error(error);
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

  const handleSavePost = async (updatedPost) => {
    try {
      setEditingPost(null);
      const resp = await updatePost(token, updatedPost);
      if (!resp.success) {
        toast.error(resp.errors[0].message);
        return;
      }
      toast.success(resp.message);
      // Refresh posts setelah update
      handleFetchPost();
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
        handleFetchPost();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteArtikel = async (id) => {
    try {
      const isYes = confirm('Delete artikel!');
      if (isYes) {
        const resp = await deleteArtikel(token, id);
        if (!resp.success) {
          toast.error(resp.message);
          return;
        }
        toast.success(resp.message);
        handleFetchArtikel();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFetchPost = async () => {
    setLoadingPosts(true);
    try {
      const resp = await getUserPost(
        token,
        user.id,
        currentPostPage,
        postsPerPage
      );

      if (!resp.success) {
        return;
      }

      setPosts(resp.data);
      setTotalPostsCount(resp.total || resp.data.length);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleFetchArtikel = async () => {
    setLoadingArtikels(true);
    try {
      const resp = await getUserArtikel(
        token,
        user.id,
        currentArtikelPage,
        artikelsPerPage
      );

      if (!resp.success) {
        return;
      }
      setArtikels(resp.data);
      setTotalArtikelsCount(resp.total || resp.data.length);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingArtikels(false);
    }
  };

  // Post pagination
  const totalPostsPages = Math.ceil(totalPostsCount / postsPerPage);
  const goToNextPage = () => {
    if (currentPostPage < totalPostsPages) {
      setCurrentPostPage(currentPostPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPostPage > 1) {
      setCurrentPostPage(currentPostPage - 1);
    }
  };

  // Artikel pagination
  const totalArtikelsPages = Math.ceil(totalArtikelsCount / artikelsPerPage);
  const goToNextArtikelPage = () => {
    if (currentArtikelPage < totalArtikelsPages) {
      setCurrentArtikelPage(currentArtikelPage + 1);
    }
  };

  const goToPrevArtikelPage = () => {
    if (currentArtikelPage > 1) {
      setCurrentArtikelPage(currentArtikelPage - 1);
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
          <div className="flex flex-row items-start md:items-end gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.full_name} />
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
              <p className="text-sm text-muted-foreground">Total Artikel</p>
              <p className="font-medium">{userStats.totalArtikels}</p>
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
            <TabsTrigger value="posts" className="whitespace-nowrap">
              Posts
            </TabsTrigger>
            <TabsTrigger value="artikels" className="whitespace-nowrap">
              Artikels
            </TabsTrigger>
            <TabsTrigger value="achievements" className="whitespace-nowrap">
              Achievements
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="space-y-8">
          <PostCard
            currentPostPage={currentPostPage}
            currentPosts={posts}
            goToNextPage={goToNextPage}
            goToPrevPage={goToPrevPage}
            handleEditPost={handleEditPost}
            setCurrentPostPage={setCurrentPostPage}
            totalPostsPages={totalPostsPages}
            loading={loadingPosts}
          />
        </TabsContent>
        <TabsContent value="artikels" className="space-y-8">
          <ArtikelCard
            currentArtikelPage={currentArtikelPage}
            currentArtikels={artikels}
            goToNextArtikelPage={goToNextArtikelPage}
            goToPrevArtikelPage={goToPrevArtikelPage}
            handleDeleteArtikel={handleDeleteArtikel}
            totalArtikelsPages={totalArtikelsPages}
            setCurrentArtikelPage={setCurrentArtikelPage}
            loading={loadingArtikels}
          />
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
