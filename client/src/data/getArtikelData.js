'use server';

import { handleApiResponse } from '@/lib/apiHandler';

export async function getAllArtikel() {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}artikels`,
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
    throw new Error('Network Error Occurred');
  }
}

export const getArtikelByID = async (id) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}artikels/${id}`,
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
    throw new Error('Network Error Occurred');
  }
};
export const getArtikelPerPage = async (limit, page, category, search) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}artikels/pagination?page=${page}&limit=${limit}&category=${category}&q=${search}`,
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
    throw new Error('Network Error Occurred');
  }
};
