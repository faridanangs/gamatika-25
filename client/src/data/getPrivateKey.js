'use server';

import { handleApiResponse } from '@/lib/apiHandler';

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
