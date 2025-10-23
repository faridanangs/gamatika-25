import ErrorPage from '@/components/ErrorPage';
import ForumPage from '@/components/Forum/Forum';
import { getAllConribs } from '@/data/getAllContribs';
import { getAllPosts } from '@/data/getPostsData';
import React from 'react';

const Forum = async () => {
  try {
    const posts = await getAllPosts();
    const contribs = await getAllConribs();
    return <ForumPage postsO={posts.data} contribsO={contribs.data} />;
  } catch (error) {
    return ErrorPage(error, 'Forum');
  }
};

export default Forum;
