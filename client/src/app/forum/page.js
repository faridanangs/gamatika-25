import ErrorPage from '@/components/ErrorPage';
import ForumPage from '@/components/Forum/Forum';
import { getAllConribs } from '@/data/getAllContribs';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const Forum = async () => {
  const session = await getServerSession(authOptions);
  try {
    const contribs = await getAllConribs();
    return <ForumPage contribsO={contribs.data} isAuth={session != null} />;
  } catch (error) {
    return ErrorPage(error, 'Forum');
  }
};

export default Forum;
