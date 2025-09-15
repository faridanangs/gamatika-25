import ForumPage from '@/components/Forum/Forum';
import { getAllConribs } from '@/data/getAllContribs';
import { getAllPosts } from '@/data/getAllPosts';
import React from 'react';

const Forum = async () => {
  const posts = await getAllPosts();
  const contribs = await getAllConribs();

  return <ForumPage postsO={posts} contribsO={contribs} />;
};

export default Forum;
