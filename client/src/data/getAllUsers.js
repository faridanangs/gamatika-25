'use server';

import { handleApiResponse } from '@/lib/apiHandler';

export async function getAllUsers(token) {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}api/users`,
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
}
