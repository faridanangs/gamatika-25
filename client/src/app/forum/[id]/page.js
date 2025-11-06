import ErrorPage from '@/components/ErrorPage';
import ForumByID from '@/components/Forum/ForumByID';
import { getPostByID } from '@/data/getPostsData';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const PostPage = async ({ params }) => {
  const session = await getServerSession(authOptions);

  const param = await params;
  try {
    const id = param.id;

    const response = await getPostByID(id);
    return (
      <ForumByID
        token={session?.accessToken}
        user={session?.user}
        isAuth={session != null}
        post={response.data}
      />
    );
  } catch (error) {
    return ErrorPage(error, 'Post By ID');
  }
};
export default PostPage;
