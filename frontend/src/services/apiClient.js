const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

let unauthorizedHandler = null;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json().catch(() => null);
};

export const apiRequest = async (endpoint, options = {}, config = {}) => {
  const { skipAuthHandling = false } = config;

  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
  });

  const data = await parseResponseBody(response);

  if (response.status === 401 && !skipAuthHandling && unauthorizedHandler) {
    unauthorizedHandler();
  }

  if (!response.ok) {
    const message = data?.message || 'Error en la solicitud';
    throw new ApiError(message, response.status, data);
  }

  return data;
};
