// Servicio para registros de enfermería
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';



export const registrosService = {
  // Obtener registros por residente con paginación
  getByResidente: async (residenteDni, page = 0, size = 5) => {
    const response = await fetch(`${API_URL}/evoluciones/residente/${residenteDni}?page=${page}&size=${size}`, {
      credentials: 'include'
    });
    return await response.json();
    
  },



  // Crear nuevo registro
  create: async (data) => {
    const response = await fetch(`${API_URL}/evoluciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return await response.json();
  },



  // Obtener registros con filtros y paginación
  getWithFilters: async (filtros, page = 0, size = 10) => {
    const response = await fetch(`${API_URL}/evoluciones/residente/filtrado?page=${page}&size=${size}` , {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros)
    });
    return await response.json();
  }
};
