'use server';

export const getUserByID = async (token, userID) => {
  const res = await fetch(`http://localhost:8080/api/users/${userID}`, {
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error('Failed fetch data posts from server');
    return;
  }

  return await res.json();
};

export const getUserProfile = async (token) => {
  const res = await fetch(`http://localhost:8080/api/users/profile`, {
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error('Failed fetch data posts from server');
    return;
  }

  return await res.json();
};

export default getUserProfile;
