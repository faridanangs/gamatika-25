import ProfilePageComp from '@/components/Dashboard/Profile';
import ErrorPage from '@/components/ErrorPage';
import { getUserProfile } from '@/data/getUserData';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
import toast from 'react-hot-toast';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  try {
    const resp = await getUserProfile(session.accessToken);
    return <ProfilePageComp user={resp.data} token={session.accessToken} />;
  } catch (error) {
    return ErrorPage(error, 'Profile');
  }
};

export default ProfilePage;
