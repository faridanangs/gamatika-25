import DashboardForumPage from '@/components/Dashboard/DashboardForum';
import ErrorPage from '@/components/ErrorPage';
import { getAllPosts } from '@/data/getPostsData';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const DashboardForum = async () => {
  const session = await getServerSession(authOptions);
  try {
    const posts = await getAllPosts();
    return (
      <DashboardForumPage
        postsO={posts.data}
        user={session.user}
        token={session.accessToken}
        isAuth={session != null}
      />
    );
  } catch (error) {
    return ErrorPage(error, 'Forum');
  }
};

export default DashboardForum;
