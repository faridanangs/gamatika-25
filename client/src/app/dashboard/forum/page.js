import DashboardForumPage from '@/components/Dashboard/DashboardForum';
import ErrorPage from '@/components/ErrorPage';
import { getPostPerPage } from '@/data/getPostsData';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
import toast from 'react-hot-toast';

const POSTS_PER_PAGE = 10;

const DashboardForum = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return ErrorPage(
      { message: 'Anda harus login untuk mengakses halaman ini' },
      'Forum'
    );
  }

  try {
    const initialPostsResponse = await getPostPerPage(1, POSTS_PER_PAGE, '');

    if (!initialPostsResponse.success) {
      toast.error(
        initialPostsResponse.message || 'Gagal memuat postingan awal'
      );
      return;
    }

    const initialPosts = initialPostsResponse.data;
    const hasMoreInitial = initialPosts.length >= POSTS_PER_PAGE;

    return (
      <DashboardForumPage
        user={session.user}
        token={session.accessToken}
        isAuth={true}
        initialPosts={initialPosts}
        hasMoreInitial={hasMoreInitial}
        postsPerPage={POSTS_PER_PAGE}
      />
    );
  } catch (error) {
    return ErrorPage(error, 'Forum');
  }
};

export default DashboardForum;
