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

  return await res.json();
};

export const getUserProfile = async (token) => {
  const resp = await fetch(`http://localhost:8080/api/users/profile`, {
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await resp.json();

  if (!resp.ok) {
    return {
      success: false,
      status: resp.status,
      ...data,
    };
  }

  return {
    success: true,
    status: resp.status,
    ...data,
  };
};

export default getUserProfile;
