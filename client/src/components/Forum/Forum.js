'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { categories } from '@/data/mockCategories';
import { ForumPost } from './ForumPost';
import { PostSkeleton } from '../skeleton/PostSkeleton';
import { TopContributorsSkeleton } from '../TopContibSkeleton';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function ForumPage({ postsO, contribsO }) {
  const [posts, setPosts] = useState([]);
  const [contribs, setContribs] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

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
    setContribs(contribsO);
  }, [postsO, contribsO]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:bg-slate-900 transition-colors duration-300 pt-10">
      <Head>
        <title>Forum Diskusi - Delta Civitas</title>
        <meta
          name="description"
          content="Forum diskusi untuk belajar sciences bersama"
        />
      </Head>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TopContributors props={contribs} />
          </div>
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Diskusi Sciences
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Forum anak MIPA: dari obrolan receh sampai riset serius.
                </p>
              </div>
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
            <div>
              {posts.length == 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))
              ) : filteredPosts?.length > 0 ? (
                filteredPosts.map((post, i) => (
                  <ForumPost
                    className={'dark:bg-gray-800'}
                    key={i}
                    post={post}
                    comments={post.comments}
                    isAuth={false}
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

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">
                Forum Diskusi Delta Civitas
              </h3>
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
                <li>Email: forum@deltacivitas.com</li>
                <li>WhatsApp: 0812-3456-7890</li>
                <li>Instagram: @forum_deltacivitas</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-6 text-center text-gray-400 dark:text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Forum Diskusi Delta Civitas. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function TopContributors({ props, isText = true, isAddress = false }) {
  if (props.length == 0) {
    return <TopContributorsSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      {isText && (
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Top Contributors{' '}
          <p className="text-[14px] text-gray-400">(setiap 7 hari)</p>
        </h2>
      )}
      <div className="space-y-4">
        {props?.map((contributor, index) => (
          <div key={index} className="flex items-center">
            <div className="relative">
              <Avatar className="w-14 h-14">
                <AvatarImage
                  src={contributor?.user.avatar}
                  alt={contributor?.user.full_name}
                />
                <AvatarFallback>
                  {(contributor?.user.full_name || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {contributor?.rank}
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {contributor?.user.username}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {contributor?.score} poin
              </p>
            </div>
            {isAddress && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      contributor?.user.wallet_address || ''
                    );
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
