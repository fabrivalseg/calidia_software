import { useState, useEffect } from 'react';
import { registrosService } from '../services/registrosService';
import { residentesService } from '../services/residentesService';
import { toast } from 'react-toastify';
import { isUnauthorized } from '../services/apiClient';

const Historial = () => {
  const [residentes, setResidentes] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const registrosPorPagina = 10;
  const [filtros, setFiltros] = useState({
    residenteDni: '',
    fechaInicio: '',
    fechaFin: '',
    turno: ''
  });

  useEffect(() => {
    loadResidentes();
  }, []);

  const loadResidentes = async () => {
    const data = await residentesService.getAll();
    setResidentes(data);
  };

  const buscarRegistros = async () => {
    // Verificar si hay algún filtro aplicado (excluyendo turno que es opcional)
    const algunFiltroAplicado = filtros.residenteDni || filtros.fechaInicio || filtros.fechaFin || filtros.turno;
    
    // Si hay algún filtro, validar que los campos obligatorios estén completos (turno es opcional)
    if (algunFiltroAplicado) {
      if (!filtros.residenteDni || !filtros.fechaInicio || !filtros.fechaFin) {
        toast.warning('Debes completar Residente, Fecha Inicio y Fecha Fin para buscar. El Turno es opcional.');
        return;
      }
    }

    setLoading(true);
    try {
      // Preparar filtros con turno como null si está vacío
      const filtrosParaEnviar = {
        ...filtros,
        turno: filtros.turno || null
      };
      
      const data = await registrosService.getWithFilters(filtrosParaEnviar, 0, registrosPorPagina);
      
      setRegistros(Array.isArray(data) ? data : []);
      setPaginaActual(0);
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          setTotalRegistros(0);
          toast.info('No se encontraron registros con los filtros aplicados');
        } else {
          // Estimación del total basada en la respuesta
          if (data.length < registrosPorPagina) {
            setTotalRegistros(data.length);
          } else {
            setTotalRegistros(registrosPorPagina + 1);
          }
          toast.success(`Se encontraron registros`);
        }
      }
    } catch (error) {
      if (!isUnauthorized(error)) {
        toast.error('Error al buscar registros');
        setRegistros([]);
        setTotalRegistros(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      residenteDni: '',
      fechaInicio: '',
      fechaFin: '',
      turno: ''
    });
    setRegistros([]);
    setTotalRegistros(0);
    setPaginaActual(0);
  };

  const getTurnoIcon = (turno) => {
    switch (turno) {
      case 'mañana': return 'M';
      case 'tarde': return 'T';
      case 'noche': return 'N';
      default: return '';
    }
  };

  const getResidenteNombre = (residenteDni) => {
    const residente = residentes.find(r => r.id === residenteDni);
    return residente ? `${residente.nombre} ${residente.apellido}` : 'Desconocido';
  };

  useEffect(() => {
    console.log('Registros actualizados:', registros);
  })

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Filtros de Búsqueda</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Residente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Residente</label>
            <select
              value={filtros.residenteDni}
              onChange={(e) => setFiltros({...filtros, residenteDni: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">Todos los residentes</option>
              {residentes.map(residente => (
                <option key={residente.id} value={residente.dni}>
                  {residente.apellido}, {residente.nombre}
                </option>
              ))}
            
            </select>
          </div>

          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Turno</label>
            <select
              value={filtros.turno}
              onChange={(e) => setFiltros({...filtros, turno: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">Todos los turnos</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          <button
            onClick={buscarRegistros}
            disabled={loading}
            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button
            onClick={limpiarFiltros}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Resultados
          </h3>
          {registros.length > 0 && (
            <p className="text-sm text-gray-500">
              Página {paginaActual + 1} - Mostrando {registros.length} registro{registros.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : registros.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No hay registros para mostrar</p>
            <p className="text-sm text-gray-400 mt-2">Ajusta los filtros y haz clic en "Buscar"</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {registros.map(registro => (
              <div key={registro.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-700 font-bold text-lg">{getTurnoIcon(registro.turno)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {getResidenteNombre(registro.residenteDni)}
                      </h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {registro.turno} • {new Date(registro.fecha).toLocaleDateString('es-AR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {registro.hora && ` - ${registro.hora}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{registro.usuarioNombre}</p>
                  </div>
                </div>

                {/* Signos Vitales */}
                {registro.signosVitales && registro.signosVitales.trim() !== '' && (
                  <div className="mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Signos Vitales
                    </p>
                    <p className="text-gray-800 leading-relaxed font-medium">{registro.signosVitales}</p>
                  </div>
                )}

                {/* Evolución */}
                {registro.evolucion && (
                  <div className="mb-4 bg-primary-50 p-4 rounded-lg border-l-4 border-primary-600">
                    <p className="text-xs font-bold text-primary-700 uppercase mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Evolución
                    </p>
                    <p className="text-gray-800 leading-relaxed">{registro.evolucion}</p>
                  </div>
                )}

                {/* Notas */}
                {registro.notas && (
                  <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Notas
                    </p>
                    <p className="text-gray-700 leading-relaxed">{registro.notas}</p>
                  </div>
                )}
              </div>
              ))}
            </div>
            
            {/* Paginación */}
            {totalRegistros > registrosPorPagina && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={async () => {
                    const nuevaPagina = Math.max(paginaActual - 1, 0);
                    setPaginaActual(nuevaPagina);
                    setLoading(true);
                    try {
                      const filtrosParaEnviar = { ...filtros, turno: filtros.turno || null };
                      const data = await registrosService.getWithFilters(filtrosParaEnviar, nuevaPagina, registrosPorPagina);
                      setRegistros(Array.isArray(data) ? data : []);
                    } catch (error) {
                      if (!isUnauthorized(error)) toast.error('Error al cargar la página');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={paginaActual === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="px-4 py-2 text-gray-700 font-medium">
                  Página {paginaActual + 1}
                </span>
                
                <button
                  onClick={async () => {
                    const nuevaPagina = paginaActual + 1;
                    setPaginaActual(nuevaPagina);
                    setLoading(true);
                    try {
                      const filtrosParaEnviar = { ...filtros, turno: filtros.turno || null };
                      const data = await registrosService.getWithFilters(filtrosParaEnviar, nuevaPagina, registrosPorPagina);
                      setRegistros(Array.isArray(data) ? data : []);
                      if (data.length < registrosPorPagina) {
                        setTotalRegistros((nuevaPagina * registrosPorPagina) + data.length);
                      } else {
                        setTotalRegistros((nuevaPagina + 1) * registrosPorPagina + 1);
                      }
                    } catch (error) {
                        if (!isUnauthorized(error)) toast.error('Error al cargar la página');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={registros.length < registrosPorPagina}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Historial;
