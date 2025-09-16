import ProfilePageComp from '@/components/Dashboard/Profile';
import getUserProfile from '@/data/getUserByID';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  const resp = await getUserProfile(session.accessToken);

  return <ProfilePageComp user={resp} token={session.accessToken} />;
};

export default ProfilePage;
