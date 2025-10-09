'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { categories, mockPosts } from '@/data/mockForum';
import CreatePostModal, {
  CreatePostButton,
  ForumPost,
} from '../Forum/ForumPost';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { PostSkeleton } from '../PostSkeleton';
import { createComment, createPost, likedToggle } from '@/lib/action';

export default function DashboardForumPage({ postsO, user, token }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (selectedCategory === 'Semua') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.category === selectedCategory)
      );
    }
  }, [selectedCategory, posts]);

  useEffect(() => {
    const sorted = postsO.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setPosts(sorted);
  }, [postsO]);

  const handleLike = async (id) => {
    try {
      const resp = await likedToggle(token, id);
      if (!resp.success) {
        resp?.errors.map((e) => {
          toast.error(e.message);
        });
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShare = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, shares: post.shares + 1 };
        }
        return post;
      })
    );
    alert('Postingan telah dibagikan!');
  };

  const handleCreatePost = async (newPost) => {
    try {
      setShowCreateModal(false);
      const resp = await createPost(token, newPost);
      if (!resp.success) {
        resp?.errors.map((e) => {
          toast.error(e.message);
        });
        return;
      }
      toast.success(resp.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddComment = async (postId, newComment) => {
    try {
      const resp = await createComment(postId, token, newComment);
      if (!resp.success) {
        toast.error(resp.errors[0].message);
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen dark:bg-card transition-colors duration-300 w-full overflow-x-hidden">
      <Head>
        <title>Forum Diskusi - Delta Civitas</title>
        <meta
          name="description"
          content="Forum diskusi untuk belajar matematika bersama"
        />
      </Head>

      <main className="px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Diskusi Sciences
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Forum anak MIPA: dari obrolan receh sampai riset serius.
                </p>
              </div>
              <CreatePostButton onClick={() => setShowCreateModal(true)} />
            </div>

            <div className="mb-6 overflow-x-auto">
              <div className="flex flex-wrap gap-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
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

            <div className="space-y-4">
              {posts.length == 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))
              ) : filteredPosts?.length > 0 ? (
                filteredPosts.map((post, i) => (
                  <ForumPost
                    key={i}
                    post={post}
                    onLike={handleLike}
                    onShare={handleShare}
                    comments={post?.comments}
                    onAddComment={handleAddComment}
                    isAuth={true}
                    user={user}
                    token={token}
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

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
}
