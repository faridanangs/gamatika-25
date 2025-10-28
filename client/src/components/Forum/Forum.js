'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { categories } from '@/data/mockCategories';
import { ForumPost } from './ForumPost';
import { PostSkeleton } from '../skeleton/PostSkeleton';
import { TopContributorsSkeleton } from '../skeleton/TopContibSkeleton';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

import { getPostPerPage } from '@/data/getPostsData';

export default function ForumPage({ contribsO, isAuth }) {
  const [contribs, setContribs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    setContribs(contribsO);
  }, [contribsO]);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const loadInitialPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      setDisplayedPosts([]);
      setPage(1);

      const categoryParam =
        selectedCategory === 'Semua' ? '' : selectedCategory;

      const response = await getPostPerPage(1, postsPerPage, categoryParam);

      if (response.success) {
        setDisplayedPosts(response.data);

        if (response.data.length < postsPerPage) {
          setHasMore(false);
        } else {
          setPage(2);
          setHasMore(true);
        }
      } else {
        toast.error(response.message || 'Gagal memuat postingan');
        setHasMore(false);
      }
    } catch (error) {
      toast.error(error.message || 'Terjadi kesalahan saat memuat postingan');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, postsPerPage]);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const categoryParam =
        selectedCategory === 'Semua' ? '' : selectedCategory;
      const response = await getPostPerPage(page, postsPerPage, categoryParam);

      if (response.success) {
        if (response.data.length > 0) {
          setDisplayedPosts((prev) => [...prev, ...response.data]);
          setPage((prev) => prev + 1);

          if (response.data.length < postsPerPage) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } else {
        toast.error(response.message || 'Gagal memuat postingan tambahan');
        setHasMore(false);
      }
    } catch (error) {
      toast.error(error.message || 'Terjadi kesalahan saat memuat postingan');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, postsPerPage, selectedCategory]);

  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

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
          <div className="lg:col-span-1 relative">
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
              {isLoading && displayedPosts.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <PostSkeleton key={i} />
                  ))
                : displayedPosts.length > 0
                ? displayedPosts.map((post, i) => {
                    if (displayedPosts.length === i + 1) {
                      return (
                        <div ref={lastPostElementRef} key={i}>
                          <ForumPost
                            className={'dark:bg-gray-800'}
                            post={post}
                            comments={post.comments}
                            isAuth={false}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <ForumPost
                          key={i}
                          className={'dark:bg-gray-800'}
                          post={post}
                          comments={post.comments}
                          isAuth={false}
                        />
                      );
                    }
                  })
                : !isLoading && (
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

              {/* Loading indicator untuk load more */}
              {isLoading && displayedPosts.length > 0 && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* End of posts message */}
              {!hasMore && displayedPosts.length > 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Tidak ada lagi postingan untuk dimuat
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300 lg:sticky lg:top-21">
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
