import { Skeleton } from './ui/skeleton';

export function EventSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 max-w-7xl mx-auto">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md z-10 pt-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <Skeleton className="h-8 w-48 mb-2 animate-shimmer" />
              <Skeleton className="h-4 w-64 animate-shimmer" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Pencarian dan Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2 animate-shimmer" />
              <div className="relative">
                <div className="relative">
                  <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-shimmer" />
                  <Skeleton className="pl-10 pr-10 w-full h-[2.32rem] animate-shimmer" />
                </div>
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2 animate-shimmer" />
              <Skeleton className="w-full h-10 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Daftar Pengumuman */}
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Skeleton className="h-6 w-20 rounded-full animate-shimmer" />
                    <Skeleton className="h-6 w-16 rounded-full animate-shimmer" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2 animate-shimmer" />
                  <Skeleton className="h-4 w-full mb-2 animate-shimmer" />
                  <Skeleton className="h-4 w-5/6 mb-3 animate-shimmer" />
                  <div className="flex items-center">
                    <Skeleton className="w-4 h-4 mr-1 animate-shimmer" />
                    <Skeleton className="h-4 w-32 animate-shimmer" />
                  </div>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <Skeleton className="mb-2 w-24 h-8 rounded animate-shimmer" />
                  <Skeleton className="w-5 h-5 animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe Notifikasi */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-4 animate-shimmer" />
            <Skeleton className="h-4 w-96 mx-auto mb-6 animate-shimmer" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="flex-grow h-12 rounded-lg animate-shimmer" />
              <Skeleton className="w-32 h-12 rounded-lg animate-shimmer" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-4 w-64 mx-auto mb-2 animate-shimmer" />
            <Skeleton className="h-3 w-48 mx-auto animate-shimmer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
