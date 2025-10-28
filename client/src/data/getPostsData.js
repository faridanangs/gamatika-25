'use server';

import { handleApiResponse } from '@/lib/apiHandler';

export async function getAllPosts() {
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}posts`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleApiResponse(resp);
  } catch (error) {
    throw new Error(error || 'Network Error Occurred');
  }
}

export async function getPostByID(id) {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}posts/${id}`,
      {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return handleApiResponse(resp);
  } catch (error) {
    throw new Error(error || 'Network Error Occurred');
  }
}
export async function getPostPerPage(page, limit, category) {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}posts/scroll?page=${page}&limit=${limit}&category=${category}`,
      {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return handleApiResponse(resp);
  } catch (error) {
    throw new Error(error || 'Network Error Occurred');
  }
}
