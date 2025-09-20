'use server';

import { revalidatePath } from 'next/cache';

export const createComment = async (postId, token, newComment) => {
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

  const data = await resp.json();

  if (!resp.ok) {
    return {
      success: false,
      status: data.status,
      ...data,
    };
  }

  revalidatePath(`/dashboard/forum`, 'page');
  revalidatePath(`/dashboard/profile`, 'page');
  return {
    success: true,
    status: data.status,
    ...data,
  };
};

export const createPost = async (token, newPost) => {
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

  const data = await resp.json();

  if (!resp.ok) {
    return {
      success: false,
      status: data.status,
      ...data,
    };
  }

  revalidatePath(`/dashboard/forum`, 'page');
  return {
    success: true,
    status: data.status,
    ...data,
  };
};

export const updatePost = async (token, newPost) => {
  const resp = await fetch(`http://localhost:8080/api/posts/${newPost.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: newPost.title,
      content: newPost.content,
    }),
  });

  const data = await resp.json();

  if (!resp.ok) {
    return {
      success: false,
      status: data.status,
      ...data,
    };
  }

  revalidatePath(`/dashboard/profile`, 'page');
  return {
    success: true,
    status: data.status,
    ...data,
  };
};

export const deletePost = async (token, postID) => {
  const resp = await fetch(`http://localhost:8080/api/posts/${postID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await resp.json();

  if (!resp.ok) {
    return {
      success: false,
      status: data.status,
      ...data,
    };
  }

  revalidatePath(`/dashboard/profile`, 'page');
  revalidatePath(`/dashboard/forum`, 'page');
  revalidatePath(`/forum`, 'page');
  return {
    success: true,
    status: data.status,
    ...data,
  };
};

export const updateUser = async (token, newUser) => {
  const resp = await fetch(`http://localhost:8080/api/users/${newUser.id}`, {
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
  });

  const data = await resp.json();

  if (!resp.ok) {
    return {
      success: false,
      status: data.status,
      ...data,
    };
  }

  revalidatePath(`/dashboard/profile`, 'page');
  return {
    success: true,
    status: data.status,
    ...data,
  };
};

export const registerUser = async (userData) => {
  const response = await fetch(`http://localhost:3000/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      ...data,
    };
  }

  return {
    success: true,
    status: response.status,
    ...data,
  };
};
