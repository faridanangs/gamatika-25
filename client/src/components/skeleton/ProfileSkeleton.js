import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

const {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} = require('../ui/card');

const ProfileSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-100">
    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
      <div className="text-center md:text-left flex-1">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const QuickActionsSkeleton = () => (
  <div className="flex flex-wrap gap-3">
    {[...Array(2)].map((_, i) => (
      <div
        key={i}
        className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
      />
    ))}
  </div>
);

const PostCardSkeleton = () => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow">
    <CardContent className="pt-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="flex gap-2 flex-wrap">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="ml-4 hidden md:block">
          <div className="w-24 h-24 rounded-lg overflow-hidden border bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ProfileSkeletonComp = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <ProfileSkeleton />
      <QuickActionsSkeleton />

      <Tabs defaultValue="overview" className="mb-8">
        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Postingan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
                {[...Array(4)].map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
