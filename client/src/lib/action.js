'use server';

import { revalidatePath } from 'next/cache';

export const createComment = async (postId, token, newComment) => {
  try {
    const resp = await fetch(
      `http://localhost:8080/api/posts/${postId}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment.content,
          image: newComment.image,
        }),
      }
    );
    if (!resp.ok) {
      console.log(resp.statusText);
    }

    const data = await resp.json();

    if (data?.error) {
      return data.error;
    }
    revalidatePath(`/dashboard/forum`, 'page');

    return null;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (token, newPost) => {
  try {
    const resp = await fetch(`http://localhost:8080/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        images: newPost.images.map((img) => img.url),
      }),
    });

    if (!resp.ok) {
      console.log(resp.statusText);
    }

    const data = await resp.json();

    if (data?.error) {
      return data.error;
    }

    setTimeout(() => {}, 1000);
    revalidatePath(`/dashboard/forum`, 'page');
  } catch (error) {}
};
