'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  FileText,
  Trophy,
  Search,
  Trash2,
  Plus,
  Star,
  Award,
  Calendar,
  MessageCircle,
  XCircle,
} from 'lucide-react';
import { deletePost, deleteUser, deleteArtikel } from '@/lib/action';
import toast from 'react-hot-toast';
import { conGetAllNFTs, conMintNFT, getAllNFTs } from '@/nft/action';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TopContributors } from '../Forum/Forum';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPostAndArtikelComp } from './AdminUserPostAndArtikelComp';

const AdminComp = ({
  initialUsers,
  initialPosts,
  initialContribs,
  token,
  initialArtikels,
}) => {
  const [users, setUsers] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [artikels, setArtikels] = useState(initialArtikels);
  const [nfts, setNfts] = useState('0');
  const [contribs, setContribs] = useState(initialContribs);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalNFTs: 0,
    totalArtikels: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPostTerm, setSearchPostTerm] = useState('');
  const [searchArtikelTerm, setSearchArtikelTerm] = useState('');
  const [recipient, setRecipient] = useState('');

  // Pagination states for posts
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Pagination states for artikels
  const [currentArtikelPage, setCurrentArtikelPage] = useState(1);
  const artikelsPerPage = 10;

  // Pagination states for users
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const usersPerPage = 10;

  // Update stats ketika data berubah
  useEffect(() => {
    setStats({
      totalPosts: posts?.length || 0,
      totalUsers: users?.length || 0,
      totalArtikels: artikels?.length || 0,
      totalNFTs: nfts,
    });
  }, [users, posts, nfts, artikels]);

  useEffect(() => {
    const nfts = async () => {
      const nftsCount = await conGetAllNFTs();
      setNfts(nftsCount.toString());
    };

    nfts();
  }, []);

  const growthData = useMemo(() => {
    if (!users || !posts || !artikels) return [];

    const now = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('id-ID', {
        month: 'short',
        year: 'numeric',
      });
      months.push({
        name: monthName,
        date: date,
        users: 0,
        posts: 0,
        artikels: 0,
      });
    }

    users.forEach((user) => {
      const userDate = new Date(user.created_at);
      const monthIndex = months.findIndex(
        (m) =>
          m.date.getMonth() === userDate.getMonth() &&
          m.date.getFullYear() === userDate.getFullYear()
      );
      if (monthIndex !== -1) {
        months[monthIndex].users += 1;
      }
    });

    posts.forEach((post) => {
      const postDate = new Date(post.created_at);
      const monthIndex = months.findIndex(
        (m) =>
          m.date.getMonth() === postDate.getMonth() &&
          m.date.getFullYear() === postDate.getFullYear()
      );
      if (monthIndex !== -1) {
        months[monthIndex].posts += 1;
      }
    });

    artikels.forEach((artikel) => {
      const artikelDate = new Date(artikel.created_at);
      const monthIndex = months.findIndex(
        (m) =>
          m.date.getMonth() === artikelDate.getMonth() &&
          m.date.getFullYear() === artikelDate.getFullYear()
      );
      if (monthIndex !== -1) {
        months[monthIndex].artikels += 1;
      }
    });

    let cumulativeUsers = 0;
    let cumulativePosts = 0;
    let cumulativeArtikels = 0;

    return months.map((month) => {
      cumulativeUsers += month.users;
      cumulativePosts += month.posts;
      cumulativeArtikels += month.artikels;

      return {
        month: month.name,
        users: cumulativeUsers,
        posts: cumulativePosts,
        artikels: cumulativeArtikels,
      };
    });
  }, [users, posts, artikels]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchPostTerm.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchPostTerm.toLowerCase())
  );

  const filteredArtikels = artikels.filter(
    (artikel) =>
      artikel.title.toLowerCase().includes(searchArtikelTerm.toLowerCase()) ||
      artikel.author?.username
        .toLowerCase()
        .includes(searchArtikelTerm.toLowerCase())
  );

  // Pagination for users
  const totalUsersPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentUserPage - 1) * usersPerPage,
    currentUserPage * usersPerPage
  );
  const goToNextUserPage = () => {
    if (currentUserPage < totalUsersPages) {
      setCurrentUserPage(currentUserPage + 1);
    }
  };
  const goToPrevUserPage = () => {
    if (currentUserPage > 1) {
      setCurrentUserPage(currentUserPage - 1);
    }
  };

  // Pagination for posts
  const totalPostsPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  const goToNextPage = () => {
    if (currentPage < totalPostsPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination for artikels
  const totalArtikelsPages = Math.ceil(
    filteredArtikels.length / artikelsPerPage
  );
  const currentArtikels = filteredArtikels.slice(
    (currentArtikelPage - 1) * artikelsPerPage,
    currentArtikelPage * artikelsPerPage
  );
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

  const handleDeleteUser = async (userId) => {
    try {
      const resp = await deleteUser(token, userId);
      if (!resp.success) {
        toast.error(resp.message);
      } else {
        setUsers(users.filter((user) => user.id !== userId));
        toast.success(resp.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const resp = await deletePost(token, postId);
      if (!resp.success) {
        toast.error(resp.message);
      } else {
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success(resp.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteArtikel = async (artikelId) => {
    try {
      const resp = await deleteArtikel(token, artikelId);
      if (!resp.success) {
        toast.error(resp.message);
      } else {
        setArtikels(artikels.filter((artikel) => artikel.id !== artikelId));
        toast.success(resp.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMintNFT = async () => {
    try {
      await conMintNFT(recipient);
      setRecipient('');
      toast.success('NFT berhasil di mint!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola platform Delta Civitas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400">
                  Total Postingan
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPosts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400">Total User</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers - 1}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Trophy
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400">Total NFT</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalNFTs}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FileText
                  className="text-orange-600 dark:text-orange-400"
                  size={24}
                />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400">
                  Total Artikel
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalArtikels}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Star className="text-yellow-500 mr-2" /> Top Contributor
          </h2>

          <TopContributors props={contribs} isText={false} isAddress={true} />
        </div>

        {/* Management Sections - Stacked Vertically */}
        <UserPostAndArtikelComp
          searchArtikelTerm={searchArtikelTerm}
          searchPostTerm={searchPostTerm}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          currentUsers={currentUsers}
          handleDeleteArtikel={handleDeleteArtikel}
          handleDeletePost={handleDeletePost}
          handleDeleteUser={handleDeleteUser}
          goToNextArtikelPage={goToNextArtikelPage}
          goToNextPage={goToNextPage}
          goToNextUserPage={goToNextUserPage}
          goToPrevArtikelPage={goToPrevArtikelPage}
          goToPrevPage={goToPrevPage}
          goToPrevUserPage={goToPrevUserPage}
          currentArtikelPage={currentArtikelPage}
          currentArtikels={currentArtikels}
          currentPage={currentPage}
          currentPosts={currentPosts}
          currentUserPage={currentUserPage}
          setCurrentArtikelPage={setCurrentArtikelPage}
          setCurrentPage={setCurrentPage}
          setCurrentUserPage={setCurrentUserPage}
          setSearchArtikelTerm={setSearchArtikelTerm}
          setSearchPostTerm={setSearchPostTerm}
          totalArtikelsPages={totalArtikelsPages}
          totalPostsPages={totalPostsPages}
          totalUsersPages={totalUsersPages}
        />

        {/* Mint NFT */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 my-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="text-purple-500 mr-2" /> Mint NFT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Penerima
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Wallet Address"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleMintNFT}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
              >
                <Plus className="mr-2" /> Mint NFT
              </button>
            </div>
          </div>
        </div>

        {/* Grafik Pertumbuhan - Updated with Wave Effect */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="text-indigo-500 mr-2" /> Pertumbuhan Platform
            (1 Tahun Terakhir)
          </h2>

          <div className="h-80">
            {growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={growthData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stackId="1" // SAMA untuk semua
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="User"
                  />
                  <Area
                    type="monotone"
                    dataKey="posts"
                    stackId="1" // SAMA untuk semua
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                    name="Post"
                  />
                  <Area
                    type="monotone"
                    dataKey="artikels"
                    stackId="1" // SAMA untuk semua
                    stroke="#ff7300"
                    fill="#ff7300"
                    fillOpacity={0.6}
                    name="Artikel"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>Belum ada data pertumbuhan untuk ditampilkan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComp;
