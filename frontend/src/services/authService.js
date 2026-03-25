import { apiRequest, ApiError } from './apiClient';

export const authService = {
  login: async (email, password) => {
    try {
      return await apiRequest('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }, {
        skipAuthHandling: true
      });
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor');
      }
      throw error;
    }
  },

  // Registrar nuevo usuario
  register: async (userData) => {
    await apiRequest('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }, {
      skipAuthHandling: true
    });
  },

  // Verificar sesión activa - La cookie se envía automáticamente
  verifySession: async () => {
    try {
      return await apiRequest('/auth/verify', {}, { skipAuthHandling: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }
      throw error;
    }
  },

  // Cerrar sesión - Elimina la cookie del servidor
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      }, {
        skipAuthHandling: true
      });
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor');
      }
      throw error;
    }
  },

  requestPasswordReset: async (email) => {
    return await apiRequest('/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }, {
      skipAuthHandling: true
    });
  },

  confirmPasswordReset: async (token, newPassword) => {
    return await apiRequest('/auth/password-reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    }, {
      skipAuthHandling: true
    });
  }
};
