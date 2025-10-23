'use server';

import { revalidatePath } from 'next/cache';
import { handleApiResponse } from './apiHandler';
import axios from 'axios';
import { redirect, RedirectType } from 'next/navigation';

// Post
export const createPost = async (token, newPost) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/posts`,
      {
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
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/forum`, 'page');
    }

    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

export const updatePost = async (token, newPost) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/posts/${newPost.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
        }),
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/forum`, 'page');
    }

    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

export const deletePost = async (token, postID) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/posts/${postID}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/profile`, 'page');
      revalidatePath(`/dashboard/admin`, 'page');
    }
    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

export const likedToggle = async (token, id) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/posts/${id}/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/profile`, 'page');
      revalidatePath(`/dashboard/forum`, 'page');
      revalidatePath(`/forum`, 'page');
    }

    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

// User
export const updateUser = async (token, newUser) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/users/${newUser.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newUser.email,
          username: newUser.username,
          avatar: newUser.avatar,
          password: newUser.password,
        }),
      }
    );

    const result = await handleApiResponse(resp);

    if (result.success) {
      revalidatePath(`/dashboard/profile`, 'page');
    }
    return result;
  } catch (error) {}
};

export const deleteUser = async (token, userID) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/users/${userID}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/admin`, 'page');
    }
    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

export const registerUser = async (userData) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}api/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await handleApiResponse(resp);

    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

// Comment
export const createComment = async (postId, token, newComment) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/posts/${postId}/comments`,
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

    const result = await handleApiResponse(resp);

    if (result.success) {
      revalidatePath(`/dashboard/forum`, 'page');
      revalidatePath(`/dashboard/profile`, 'page');
    }

    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

export const deleteComment = async (token, id) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/comments/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/profile`, 'page');
      revalidatePath(`/dashboard/forum`, 'page');
    }
    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

export const updateComment = async (token, newComment) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/comments/${newComment.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment.content,
        }),
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/profile`, 'page');
      revalidatePath(`/dashboard/forum`, 'page');
      revalidatePath(`/forum`, 'page');
    }

    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

// Artikel
export const createArtikel = async (token, newArtikel) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/artikels`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newArtikel.title,
          category: newArtikel.category,
          tags: newArtikel.tags,
          content: newArtikel.content,
        }),
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/profile`, 'page');
    }

    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};

export const deleteArtikel = async (token, id) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/artikels/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await handleApiResponse(resp);
    if (result.success) {
      revalidatePath(`/dashboard/profile`, 'page');
    }
    return result;
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};
