'use server';

import { handleApiResponse } from '@/lib/apiHandler';

export async function getAllConribs() {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}users/top-contributors`,
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
