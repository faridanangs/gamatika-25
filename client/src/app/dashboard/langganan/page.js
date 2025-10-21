import SubscriptionPage from '@/components/Dashboard/Langganan';
import getUserProfile from '@/data/getUserByID';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async () => {
  const session = await getServerSession(authOptions);

  try {
    const resp = await getUserProfile(session.accessToken);
    return <SubscriptionPage user={resp.data} token={session.accessToken} />;
  } catch (error) {
    return ErrorPage(error, 'Langganan');
  }
};

export default page;
