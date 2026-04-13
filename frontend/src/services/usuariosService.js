import { apiRequest } from './apiClient';

export const usuariosService = {
  getAll: async () => {
    return await apiRequest('/usuarios');
  },

  create: async (userData) => {
    return await apiRequest('/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  },

  remove: async (email) => {
    return await apiRequest(`/usuarios/${encodeURIComponent(email)}`, {
      method: 'DELETE'
    });
  }
};
