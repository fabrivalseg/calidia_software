// Servicio de autenticación conectado con backend real

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Credenciales inválidas' }));
        throw new Error(error.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor');
      }
      throw error;
    }
  },

  // Registrar nuevo usuario
  register: async (userData) => {

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }
    
  },

  // Verificar sesión activa - La cookie se envía automáticamente
  verifySession: async () => {
    // TODO: Implementar verificación real
    // const response = await fetch(`${API_URL}/auth/verify`, {
    //   credentials: 'include' // La cookie se envía automáticamente
    // });
    // if (!response.ok) return null;
    // return await response.json(); // Retorna datos del usuario si la sesión es válida
    
    return true;
  },

  // Cerrar sesión - Elimina la cookie del servidor
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include' // Envía la cookie para identificar la sesión
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al cerrar sesión' }));
        throw new Error(error.message || 'Error al cerrar sesión');
      }

      return await response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor');
      }
      throw error;
    }
  }
};
