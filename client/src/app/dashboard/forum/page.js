import DashboardForumPage from '@/components/Forum/DashboardForum';
import { getAllPosts } from '@/data/getAllPosts';
import React from 'react';

const DashboardForum = async () => {
  const posts = await getAllPosts();
  return <DashboardForumPage postsO={posts} />;
};

export default DashboardForum;
