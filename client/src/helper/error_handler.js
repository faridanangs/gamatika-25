import { signOut } from 'next-auth/react';

export const handleServerResponse = async (response) => {
  if (!response) {
    throw new Error('Network error: Failed to fetch data');
  }

  const data = await response.json().catch(() => ({}));

  if (response.ok) {
    return data;
  }

  switch (response.status) {
    case 401:
      throw new Error('Authentication failed: Invalid or expired token');
    case 403:
      throw new Error('Authorization failed: You do not have permission');
    case 404:
      throw new Error('Resource not found: User/profile does not exist');
    case 422:
      throw new Error(
        `Validation error: ${data.message || 'Invalid input data'}`
      );
    case 500:
      throw new Error(
        `Server error: ${data.message || 'Internal server error'}`
      );
    default:
      const errorMessage = data.message || `Error ${response.status}`;
      throw new Error(`${errorMessage} (${response.status})`);
  }
};
