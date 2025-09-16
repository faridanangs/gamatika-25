'use client';
import { Skeleton } from '@/components/ui/skeleton';

export function TopContributorsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm shadow-xl dark:shadow-gray-600 dark:shadow-sm p-6 mb-4 transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Top Contributor{' '}
        <p className="text-[14px] text-gray-400">(setiap 7 hari)</p>
      </h2>
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center">
            <div className="relative">
              <Skeleton className="w-12 h-12 rounded-full dark:bg-gray-700" />
            </div>
            <div className="ml-3 flex-1 space-y-2">
              <Skeleton className="h-4 w-32 dark:bg-gray-700" />
              <Skeleton className="h-3 w-48 dark:bg-gray-700" />
              <Skeleton className="h-3 w-24 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
