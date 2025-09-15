'use server';

export async function getAllPosts() {
  const res = await fetch('http://localhost:8080/posts', {
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
