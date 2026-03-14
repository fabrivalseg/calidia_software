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

export const isUnauthorized = (error) =>
  error instanceof ApiError && error.status === 401;

export const getErrorMessage = (error, fallback = 'Ocurrio un error inesperado') => {
  if (!error) {
    return fallback;
  }

  if (error instanceof ApiError) {
    if (error.data?.message) {
      return error.data.message;
    }

    if (error.message) {
      return error.message;
    }

    if (error.status === 401) {
      return 'Sesion expirada o no autorizada';
    }

    if (error.status === 403) {
      return 'No tenes permisos para realizar esta accion';
    }
  }

  if (error.message === 'Failed to fetch') {
    return 'No se pudo conectar con el servidor';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
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

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
    });
  } catch (error) {
    throw new ApiError(getErrorMessage(error, 'No se pudo conectar con el servidor'), 0, null);
  }

  const data = await parseResponseBody(response);

  if (response.status === 401 && !skipAuthHandling && unauthorizedHandler) {
    unauthorizedHandler();
  }

  if (!response.ok) {
    const message = data?.message || `La solicitud fallo con codigo ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
};
