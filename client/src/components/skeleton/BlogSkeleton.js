export const BlogDetailSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen pt-12">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-4 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse"></div>

            <div className="flex gap-3">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-4 md:p-8">
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Tags Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center mb-3">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Related Articles Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg mr-3 animate-pulse">
                    <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Komponen Skeleton khusus untuk halaman Blogs
export const BlogsPageSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Skeleton */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="h-10 w-48 bg-blue-400/30 rounded-lg animate-pulse mb-2"></div>
              <div className="h-5 w-32 bg-blue-300/30 rounded-lg animate-pulse"></div>
            </div>
            <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
              <div className="h-5 w-24 bg-white/30 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Pencarian dan Filter Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="relative">
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Daftar Blogs Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded mr-1 animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>

                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>

                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="h-10 bg-gray-100 dark:bg-gray-700/50"></div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        {/* Subscribe Notifikasi Skeleton */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-8 w-64 bg-white/20 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 w-full bg-white/10 rounded-lg mb-6 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-full sm:w-64 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="h-12 w-32 bg-white/30 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="h-5 w-64 bg-gray-700 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
