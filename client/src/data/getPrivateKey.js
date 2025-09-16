'use server';

export const getPrivateKey = async (token, password) => {
  try {
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
    if (!resp.ok) {
      console.error(resp.statusText);
    }

    const data = await resp.json();

    if (data?.error) {
      return data;
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};
