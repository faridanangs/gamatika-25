import DashboardForumPage from '@/components/Dashboard/DashboardForum';
import { getAllPosts } from '@/data/getAllPosts';
import React from 'react';

const DashboardForum = async () => {
  const posts = await getAllPosts();

  return <DashboardForumPage postsO={posts.data} />;
};

export default DashboardForum;
