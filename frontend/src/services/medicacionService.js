// Servicio para gestión de medicación
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';



export const medicacionService = {

  getByResidente: async (residenteDni) => {

    const response = await fetch(`${API_URL}/medicaciones/residente/${residenteDni}`, {
      credentials: 'include'
    });
    return await response.json();
  },

  // Crear nueva medicación
  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await fetch(`${API_URL}/medicaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  // Actualizar medicación
  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    try{
      const response = await fetch(`${API_URL}/medicaciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return await response.json();
    } catch{
      throw new Error('Medicación no encontrada');
    }


  },



};
