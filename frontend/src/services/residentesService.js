// Servicio para gestión de residentes
// Preparado para conectar con backend real

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';


export const residentesService = {

  getAll: async () => {
  const respuesta = await fetch(`${API_URL}/residentes`, {
    credentials: "include" 
  });

  if (!respuesta.ok) {
    throw new Error("No autorizado o error al obtener residentes");
  }

  return await respuesta.json();
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
    const response = await fetch(`${API_URL}/residentes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return await response.json();

  }
};
