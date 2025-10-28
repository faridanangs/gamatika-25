export const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (errorData.status === 'error' && errorData.errors) {
      return {
        success: false,
        status: response.status,
        message: errorData.message || 'Request failed',
        errors: errorData.errors,
      };
    }

    return {
      success: false,
      status: response.status,
      message: errorData.message || errorData.error || 'Request failed',
      errors: errorData.errors || {},
    };
  }

  return null;
};

export const handleApiResponse = async (response) => {
  const error = await handleApiError(response);
  if (error) return error;

  const data = await response.json();

  return {
    success: true,
    status: response.status,
    message: data.message,
    data: data.data || data,
    total: data?.total,
  };
};
