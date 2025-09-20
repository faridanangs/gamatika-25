'use server';

export const getPrivateKey = async (token, password) => {
  const resp = await fetch(`http://localhost:8080/api/users/private-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password,
    }),
  });

  const data = await resp.json();

  if (!resp.ok) {
    return {
      success: false,
      status: data.status,
      ...data,
    };
  }

  return {
    success: true,
    status: data.status,
    ...data,
  };
};
