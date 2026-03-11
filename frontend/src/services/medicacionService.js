// Servicio para gestión de medicación
import { apiRequest } from './apiClient';



export const medicacionService = {

  getByResidente: async (residenteDni) => {
    return await apiRequest(`/medicaciones/residente/${residenteDni}`);
  },

  // Crear nueva medicación
  create: async (data) => {
    return await apiRequest('/medicaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Actualizar medicación
  update: async (id, data) => {
    return await apiRequest(`/medicaciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },



};
