import CreateArticlePage from '@/components/Dashboard/Artikel';
import ErrorPage from '@/components/ErrorPage';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const page = async () => {
  const session = await getServerSession(authOptions);

  try {
    return <CreateArticlePage token={session.accessToken} />;
  } catch (error) {
    return ErrorPage(error, 'Artikel');
  }
};

export default page;
