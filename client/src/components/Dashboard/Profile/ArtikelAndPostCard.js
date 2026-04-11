"use client";
import React from "react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatReadableTime } from "@/lib/timeReadable";
import { RenderReactMarkDown } from "@/lib/reactMarkDown";
import { useRouter } from "next/navigation";

// Komponen Skeleton untuk Artikel
const ArtikelSkeleton = () => (
  <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
    {[...Array(4)].map((_, index) => (
      <Card key={index} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Komponen Skeleton untuk Postingan
const PostSkeleton = () => (
  <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
    {[...Array(4)].map((_, index) => (
      <Card key={index} className="hover:shadow-md transition-shadow">
        <CardContent className="pt-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse mb-2"></div>
              <div className="space-y-1 mb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4 animate-pulse"></div>
              </div>
            </div>
            <div className="ml-4 hidden md:block">
              <div className="w-24 h-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ArtikelCard = ({
  currentArtikels,
  handleDeleteArtikel,
  goToNextArtikelPage,
  goToPrevArtikelPage,
  currentArtikelPage,
  totalArtikelsPages,
  setCurrentArtikelPage,
  loading = false,
}) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="p-0">
        <CardTitle>Artikel</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <ArtikelSkeleton />
        ) : (
          <>
            <div className="lg:space-y-4 space-y-2 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
              {currentArtikels.map((artkl) => (
                <Card
                  key={artkl.id}
                  className=" hover:shadow-md transition-shadow relative"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg lg:text-2xl font-semibold">
                        {artkl.title}
                      </h4>
                      <Trash2
                        onClick={() => handleDeleteArtikel(artkl.id)}
                        className="size-4 hover:cursor-pointer max-w-4 min-w-4 text-red-400"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {formatReadableTime(artkl.created_at)}
                    </p>
                  </CardHeader>
                  <CardContent className="lg:pt-2 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div>
                          {" "}
                          {artkl.tags && artkl.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {artkl.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-gray-600 border-b"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="inline-block text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                            <RenderReactMarkDown
                              content={artkl.content}
                              isSubstring={true}
                              lenght={200}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/blogs/${artkl.id}`}
                      className="underline text-sm mt-2 inline-block absolute bottom-2 right-2"
                    >
                      lihat detail
                    </Link>
                  </CardFooter>
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
                    { length: Math.min(5, totalArtikelsPages) },
                    (_, i) => {
                      let page;
                      if (totalArtikelsPages <= 5) {
                        page = i + 1;
                      } else if (currentArtikelPage <= 3) {
                        page = i + 1;
                      } else if (currentArtikelPage >= totalArtikelsPages - 2) {
                        page = totalArtikelsPages - 4 + i;
                      } else {
                        page = currentArtikelPage - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={
                            currentArtikelPage === page ? "default" : "outline"
                          }
                          onClick={() => setCurrentArtikelPage(page)}
                          className="flex-shrink-0 w-10 h-10 min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    },
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const PostCard = ({
  handleEditPost,
  currentPosts,
  totalPostsPages,
  currentPostPage,
  goToNextPage,
  goToPrevPage,
  setCurrentPostPage,
  loading = false,
}) => {
  const router = useRouter();
  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content?.substring(0, 20) + "...",
        url: `${window.location.origin}/forum/${post.id}`,
      });
    } else {
      alert("Link disalin ke clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="p-0">
        <CardTitle>Postingan</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <PostSkeleton />
        ) : (
          <>
            <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
              {currentPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4
                            className="font-semibold cursor-pointer underline"
                            onClick={() => router.push(`/forum/${post.id}`)}
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
                  disabled={currentPostPage === 1}
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
                  {Array.from(
                    { length: Math.min(5, totalPostsPages) },
                    (_, i) => {
                      let page;
                      if (totalPostsPages <= 5) {
                        page = i + 1;
                      } else if (currentPostPage <= 3) {
                        page = i + 1;
                      } else if (currentPostPage >= totalPostsPages - 2) {
                        page = totalPostsPages - 4 + i;
                      } else {
                        page = currentPostPage - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={
                            currentPostPage === page ? "default" : "outline"
                          }
                          onClick={() => setCurrentPostPage(page)}
                          className="flex-shrink-0 w-10 h-10 min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={currentPostPage === totalPostsPages}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
