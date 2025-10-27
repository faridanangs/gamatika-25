'use client';
import { ForumPost } from '@/components/Forum/ForumPost';
import { createComment, likedToggle } from '@/lib/action';
import toast from 'react-hot-toast';

export default function ForumByID({ token, user, isAuth, post }) {
  const handleLike = async (id) => {
    try {
      const resp = await likedToggle(token, id);
      if (!resp.success) {
        resp?.errors.map((e) => {
          toast.error(e.message);
        });
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddComment = async (postId, newComment) => {
    try {
      const resp = await createComment(postId, token, newComment);
      if (!resp.success) {
        toast.error(resp.errors[0].message);
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {post.length == 0 ? (
        ''
      ) : (
        <ForumPost
          className={'mt-20 max-w-5xl mx-auto'}
          post={post}
          comments={post.comments}
          onAddComment={handleAddComment}
          onLike={handleLike}
          token={token}
          user={user}
          isAuth={isAuth}
        />
      )}
    </>
  );
}
