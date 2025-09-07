'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { mockContributors } from '@/data/mockForum';
import { categories, mockPosts } from '@/data/mockForum';
import CreatePostModal, { CreatePostButton, ForumPost } from './ForumPost';

// Main Forum Page Component
export default function ForumPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  // Apply theme
  useEffect(() => {
    if (mounted) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, mounted]);
  // Filter posts by category
  useEffect(() => {
    if (selectedCategory === 'Semua') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.category === selectedCategory)
      );
    }
  }, [selectedCategory, posts]);
  // Handle like action
  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          };
        }
        return post;
      })
    );
  };
  // Handle comment action
  const handleComment = (postId) => {
    // This is handled by the ForumPost component
  };
  // Handle share action
  const handleShare = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, shares: post.shares + 1 };
        }
        return post;
      })
    );
    // In a real app, this would trigger the share functionality
    alert('Postingan telah dibagikan!');
  };
  // Handle create new post
  const handleCreatePost = (newPost) => {
    const post = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: {
        id: 999,
        name: 'Anda',
        avatar: 'https://i.pravatar.cc',
      },
      likes: 0,
      commentCount: 0,
      shares: 0,
      timestamp: 'Baru saja',
      liked: false,
      images: newPost.images.map((img) => img.url),
      comments: [],
    };
    setPosts([post, ...posts]);
  };
  // Handle add comment
  const handleAddComment = (postId, newComment) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const comment = {
            id: Date.now(),
            author: {
              id: 999,
              name: 'Anda',
              avatar: 'https://i.pravatar.cc',
            },
            content: newComment.content,
            timestamp: 'Baru saja',
            images: newComment.images, // Langung gunakan array gambar tanpa mapping
          };
          return {
            ...post,
            commentCount: post.commentCount + 1,
            comments: [...post.comments, comment],
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-10">
      <Head>
        <title>Forum Diskusi - Angkatan 25 Gamatika</title>
        <meta
          name="description"
          content="Forum diskusi untuk belajar matematika bersama"
        />
      </Head>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Top Contributors */}
          <div className="lg:col-span-1">
            <TopContributors />
          </div>
          {/* Right Main Content */}
          <div className="lg:col-span-3">
            {/* Header with Create Post Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Diskusi Matematika
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Bertukar pengetahuan dan memecahkan masalah bersama
                </p>
              </div>
              <CreatePostButton onClick={() => setShowCreateModal(true)} />
            </div>
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {/* Forum Posts */}
            <div>
              {filteredPosts?.length > 0 ? (
                filteredPosts.map((post, i) => (
                  <ForumPost
                    key={i}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    comments={post.comments}
                    onAddComment={handleAddComment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 inline-block mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400 dark:text-gray-500"
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
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Tidak ada postingan di kategori ini
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Coba pilih kategori lain atau buat postingan baru
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePost}
      />
      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Forum Diskusi Gamatika</h3>
              <p className="text-gray-400 dark:text-gray-500">
                Platform diskusi untuk belajar matematika bersama angkatan 25
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Aturan Forum</h3>
              <ul className="text-gray-400 dark:text-gray-500 space-y-2">
                <li>• Hormati sesama anggota</li>
                <li>• Sampaikan pertanyaan dengan jelas</li>
                <li>• Berikan kontribusi yang positif</li>
                <li>• Hindari spam dan konten tidak sesuai</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kontak</h3>
              <ul className="text-gray-400 dark:text-gray-500 space-y-2">
                <li>Email: forum@gamatika25.com</li>
                <li>WhatsApp: 0812-3456-7890</li>
                <li>Instagram: @forum_gamatika25</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-6 text-center text-gray-400 dark:text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Forum Diskusi Angkatan 25
              Gamatika. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TopContributors() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Top Contributor
      </h2>
      <div className="space-y-4">
        {mockContributors.map((contributor, index) => (
          <div key={contributor.id} className="flex items-center">
            <div className="relative">
              <img
                src={contributor.avatar}
                alt={contributor.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {index + 1}
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {contributor.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {contributor.posts} posts • {contributor.points} pts
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {contributor.expertise.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
