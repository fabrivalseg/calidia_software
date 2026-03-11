// Servicio para gestión de residentes
// Preparado para conectar con backend real

import { apiRequest } from './apiClient';


export const residentesService = {

  getAll: async () => {
    return await apiRequest('/residentes');
  },


  // Buscar residentes
  search: async (residentes, query) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const lowerQuery = query.toLowerCase();
    return residentes.filter(r => 
      r.nombre.toLowerCase().includes(lowerQuery) ||
      r.apellido.toLowerCase().includes(lowerQuery) ||
      r.dni.includes(query)
    );
  },

  // Crear residente
  create: async (data) => {
    return await apiRequest('/residentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
