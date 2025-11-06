'use server';

import { handleApiResponse } from '@/lib/apiHandler';

export const getUserByID = async (token, userID) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/users/${userID}`,
      {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return handleApiResponse(resp);
  } catch (error) {
    throw new Error(error || 'Network Error Occurred');
  }
};
export const getUserPost = async (token, userID, page, limit) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/users/post/${userID}?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return handleApiResponse(resp);
  } catch (error) {
    throw new Error(error || 'Network Error Occurred');
  }
};
export const getUserArtikel = async (token, userID, page, limit) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/users/artikel/${userID}?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return handleApiResponse(resp);
  } catch (error) {
    throw new Error(error || 'Network Error Occurred');
  }
};

export const getUserProfile = async (token) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/users/profile`,
      {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return handleApiResponse(resp);
  } catch (error) {
    throw new Error(error || 'Network Error Occurred');
  }
};

export const getPrivateKey = async (token, password) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/users/private-key`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password,
        }),
      }
    );

    return handleApiResponse(resp);
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
};
