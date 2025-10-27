import ErrorPage from '@/components/ErrorPage';
import ForumPage from '@/components/Forum/Forum';
import { getAllConribs } from '@/data/getAllContribs';
import { getAllPosts } from '@/data/getPostsData';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const Forum = async () => {
  const session = await getServerSession(authOptions);
  try {
    const posts = await getAllPosts();
    const contribs = await getAllConribs();
    return (
      <ForumPage
        postsO={posts.data}
        contribsO={contribs.data}
        isAuth={session != null}
      />
    );
  } catch (error) {
    return ErrorPage(error, 'Forum');
  }
};

export default Forum;
