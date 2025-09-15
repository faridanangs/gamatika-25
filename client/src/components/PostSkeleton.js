// components/PostSkeleton.jsx
import { Skeleton } from '@/components/ui/skeleton';

export function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-xl dark:shadow-gray-300 dark:shadow-sm p-6 mb-4 transition-colors duration-300">
      <div className="flex items-start mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="ml-3 flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 mb-2" />
      <Skeleton className="h-4 mb-2" />
      <Skeleton className="h-4 w-5/6" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
        <Skeleton className="w-5 h-5" />
      </div>
    </div>
  );
}
