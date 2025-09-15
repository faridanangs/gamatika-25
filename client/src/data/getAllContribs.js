'use server';

export async function getAllConribs() {
  const res = await fetch('http://localhost:8080/users/top-contributors', {
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
