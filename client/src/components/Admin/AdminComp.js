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
import { deletePost, deleteUser } from '@/lib/action';
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
} from 'recharts';
import { TopContributors } from '../Forum/Forum';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const AdminComp = ({ initialUsers, initialPosts, initialContribs, token }) => {
  const [users, setUsers] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [nfts, setNfts] = useState('0');
  const [contribs, setContribs] = useState(initialContribs);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalNFTs: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPostTerm, setSearchPostTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // State untuk form mint NFT
  const [recipient, setRecipient] = useState('');

  // Update stats ketika data berubah
  useEffect(() => {
    setStats({
      totalPosts: posts?.length || 0,
      totalUsers: users?.length || 0,
      totalNFTs: nfts,
    });
  }, [users, posts, nfts]);

  // Simulasi loading data
  useEffect(() => {
    const nfts = async () => {
      const nftsCount = await conGetAllNFTs();
      setNfts(nftsCount.toString());
    };

    nfts();
  }, []);

  // Hitung data pertumbuhan berdasarkan data yang ada
  const growthData = useMemo(() => {
    if (!users || !posts) return [];

    // Fungsi untuk format tanggal menjadi bulan dan tahun
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        month: 'short',
        year: 'numeric',
      });
    };

    // Dapatkan semua bulan unik dari users dan posts
    const months = new Set();
    users.forEach((user) => {
      months.add(formatDate(user.created_at));
    });
    posts.forEach((post) => {
      months.add(formatDate(post.created_at));
    });

    const sortedMonths = Array.from(months).sort((a, b) => {
      const [aMonth, aYear] = a.split('-');
      const [bMonth, bYear] = b.split('-');
      const yearDiff = parseInt(aYear) - parseInt(bYear);
      if (yearDiff !== 0) return yearDiff;
      return aMonth.localeCompare(bMonth);
    });

    // Hitung jumlah user per bulan
    const userCounts = {};
    sortedMonths.forEach((month) => {
      userCounts[month] = users.filter((user) => {
        return formatDate(user.created_at) === month;
      }).length;
    });

    // Hitung jumlah post per bulan
    const postCounts = {};
    sortedMonths.forEach((month) => {
      postCounts[month] = posts.filter((post) => {
        return formatDate(post.created_at) === month;
      }).length;
    });

    // Gabungkan data
    return sortedMonths.map((month) => ({
      month,
      users: userCounts[month],
      posts: postCounts[month],
    }));
  }, [users, posts]);

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

  const handleDeleteUser = async (userId) => {
    try {
      const resp = await deleteUser(token, userId);
      if (!resp.success) {
        toast.error(resp.message);
      } else {
        // Update state users setelah berhasil dihapus
        setUsers(users.filter((user) => user.id !== userId));
        toast.success(resp.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    try {
      const resp = await deletePost(token, postId);
      if (!resp.success) {
        toast.error(resp.message);
      } else {
        // Update state posts setelah berhasil dihapus
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success(resp.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle mint NFT
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  {stats.totalUsers}
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
        </div>

        {/* Top Contributors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Star className="text-yellow-500 mr-2" /> Top Contributor
          </h2>

          <TopContributors props={contribs} isText={false} isAddress={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="text-blue-500 mr-2" /> Kelola User
            </h2>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari user..."
                  className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Postingan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={user.avatar}
                              alt={user.full_name}
                            />
                            <AvatarFallback>
                              {(user.full_name || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.posts?.length || 0} postingan
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                        >
                          <Trash2 className="mr-1" size={16} /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Post Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="text-green-500 mr-2" /> Kelola Postingan
            </h2>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari postingan..."
                  className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchPostTerm}
                  onChange={(e) => setSearchPostTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Penulis
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.created_at).toLocaleDateString(
                            'id-ID'
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {post.author.username}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                        >
                          <Trash2 className="mr-1" size={16} /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mint NFT */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 my-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="text-purple-500 mr-2" /> Mint NFT
          </h2>

          <div className="grid grid-cols-1 gap-4">
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

            <div className="md:col-span-1 md:col-start-3 flex items-end">
              <button
                onClick={handleMintNFT}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
              >
                <Plus className="mr-2" /> Mint NFT
              </button>
            </div>
          </div>
        </div>

        {/* Grafik Pertumbuhan */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="text-indigo-500 mr-2" /> Pertumbuhan Platform
          </h2>

          <div className="h-80">
            {growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="User"
                  />
                  <Line
                    type="monotone"
                    dataKey="posts"
                    stroke="#82ca9d"
                    name="Post"
                  />
                </LineChart>
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
