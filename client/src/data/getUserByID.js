'use server';

import { handleServerResponse } from '@/helper/error_handler';

export const getUserByID = async (token, userID) => {
  const res = await fetch(`http://localhost:8080/api/users/${userID}`, {
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const getUserProfile = async (token) => {
  try {
    const res = await fetch(`http://localhost:8080/api/users/profile`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleServerResponse(res);
  } catch (error) {
    console.log('API Error:', error.message);
  }
};

export default getUserProfile;
