import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { formatReadableTime } from '@/lib/timeReadable';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export const ArtikelCard = ({
  currentArtikels,
  handleDeleteArtikel,
  goToNextArtikelPage,
  goToPrevArtikelPage,
  currentArtikelPage,
  totalArtikelsPages,
  setCurrentArtikelPage,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artikel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
          {currentArtikels.map((artkl) => (
            <Card key={artkl.id} className=" hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{artkl.title}</h4>
                  <Trash2
                    onClick={() => handleDeleteArtikel(artkl.id)}
                    className="size-4 hover:cursor-pointer max-w-4 min-w-4 text-red-400"
                  />
                </div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {formatReadableTime(artkl.created_at)}
                </p>
              </CardHeader>
              <CardContent className="pt-4 overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {artkl.tags && artkl.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {artkl.tags.map((tag, index) => (
                          <span key={index} className="text-gray-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="inline-block text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ''
                            );
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          table({ children }) {
                            return (
                              <div className="overflow-x-auto">
                                <table className="min-w-full my-4 border-collapse border border-gray-300 dark:border-gray-700">
                                  {children}
                                </table>
                              </div>
                            );
                          },
                          th({ children }) {
                            return (
                              <th className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-left font-semibold">
                                {children}
                              </th>
                            );
                          },
                          td({ children }) {
                            return (
                              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                {children}
                              </td>
                            );
                          },
                        }}
                      >
                        {artkl.content.substring(0, 120) + '...'}
                      </ReactMarkdown>
                    </div>
                    <Link
                      href={`/blogs/${artkl.id}`}
                      className="underline text-sm mt-2"
                    >
                      lihat detail
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {currentArtikels.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada artikel
            </div>
          )}
        </div>
        {totalArtikelsPages > 1 && (
          <div className="flex items-center justify-center mt-6 space-x-2 overflow-x-auto py-2">
            <Button
              variant="outline"
              onClick={goToPrevArtikelPage}
              disabled={currentArtikelPage === 1}
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

            {/* Page Numbers for Artikels */}
            <div className="flex space-x-1 overflow-x-auto py-1">
              {Array.from(
                { length: Math.min(3, totalArtikelsPages) },
                (_, i) => {
                  let page;
                  if (totalArtikelsPages <= 3) {
                    page = i + 1;
                  } else if (currentArtikelPage <= 3) {
                    page = i + 1;
                  } else if (currentArtikelPage >= totalArtikelsPages - 2) {
                    page = totalArtikelsPages - 2 + i;
                  } else {
                    page = currentArtikelPage - 1 + i;
                  }

                  return (
                    <Button
                      key={page}
                      variant={
                        currentArtikelPage === page ? 'default' : 'outline'
                      }
                      onClick={() => setCurrentArtikelPage(page)}
                      className="flex-shrink-0 w-10 h-10 min-w-[40px]"
                    >
                      {page}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              onClick={goToNextArtikelPage}
              disabled={currentArtikelPage === totalArtikelsPages}
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
  );
};

export const PostCard = ({
  handleViewPost,
  handleEditPost,
  currentPosts,
  totalPostsPages,
  currentPage,
  goToNextPage,
  goToPrevPage,
  setCurrentPage,
}) => {
  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content?.substring(0, 20) + '...',
        url: `${window.location.origin}/forum/${post.id}`,
      });
    } else {
      alert('Link disalin ke clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Postingan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
          {currentPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4
                        className="font-semibold cursor-pointer underline"
                        onClick={() => handleViewPost(post)}
                      >
                        {post.title}
                      </h4>
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
                      <span className="text-muted-foreground">
                        💬 {post?.comment_count || 0}
                      </span>
                      <span className="text-muted-foreground">
                        ❤️ {post?.like_count || 0}
                      </span>
                      <span className="text-muted-foreground cursor-pointer">
                        <Share2
                          className="size-4"
                          onClick={() => handleShare(post)}
                        />
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
        {totalPostsPages > 1 && (
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
              {Array.from({ length: Math.min(3, totalPostsPages) }, (_, i) => {
                let page;
                if (totalPostsPages <= 3) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPostsPages - 2) {
                  page = totalPostsPages - 2 + i;
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
              disabled={currentPage === totalPostsPages}
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
  );
};
