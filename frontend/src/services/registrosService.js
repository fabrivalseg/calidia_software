// Servicio para registros de enfermería
import { apiRequest } from './apiClient';



export const registrosService = {
  // Obtener registros por residente con paginación
  getByResidente: async (residenteDni, page = 0, size = 5) => {
    return await apiRequest(`/evoluciones/residente/${residenteDni}?page=${page}&size=${size}`);
  },



  // Crear nuevo registro
  create: async (data) => {
    return await apiRequest('/evoluciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },



  // Obtener registros con filtros y paginación
  getWithFilters: async (filtros, page = 0, size = 10) => {
    return await apiRequest(`/evoluciones/residente/filtrado?page=${page}&size=${size}` , {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros)
    });
  }
};
