import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const {
  default: CreateArticlePage,
} = require('@/components/Dashboard/Artikel');

const page = async () => {
  const session = await getServerSession(authOptions);

  try {
    return <CreateArticlePage token={session.accessToken} />;
  } catch (error) {
    return ErrorPage(error, 'Artikel');
  }
};

export default page;
