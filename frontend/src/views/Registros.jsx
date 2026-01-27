import { useState, useEffect } from 'react';
import { registrosService } from '../services/registrosService';
import { residentesService } from '../services/residentesService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Registros = () => {
  const [residentes, setResidentes] = useState([]);
  const [residenteSeleccionado, setResidenteSeleccionado] = useState(null);
  const [turnoActual, setTurnoActual] = useState('mañana');
  const [fechaActual, setFechaActual] = useState(new Date().toISOString().split('T')[0]);
  const [horaActual, setHoraActual] = useState(new Date().toTimeString().slice(0, 5));
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const registrosPorPagina = 5;
  const { user } = useAuth();

  const [formulario, setFormulario] = useState({
    evolucion: '',
    notas: '',
    tensionArterial: '',
    temperatura: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    glucemia: '',
    saturacionOxigeno: ''
  });

  useEffect(() => {
    loadResidentes();
  }, []);

  useEffect(() => {
    if (residenteSeleccionado) {
      loadRegistros();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residenteSeleccionado, paginaActual]);

  const loadResidentes = async () => {
    const data = await residentesService.getAll();
    setResidentes(data);
  };

  const loadRegistros = async () => {
    setLoading(true);
    try {
      const data = await registrosService.getByResidente(
        residenteSeleccionado.dni,
        paginaActual,
        registrosPorPagina
      );
      
      // El backend devuelve un array, necesitamos saber el total
      // Asumimos que el backend devuelve todos los registros de la página actual
      setRegistros(data);
      
      // Si recibimos menos registros que el tamaño de página, estamos en la última página
      if (data.length < registrosPorPagina && paginaActual === 0) {
        setTotalRegistros(data.length);
      } else if (data.length < registrosPorPagina) {
        setTotalRegistros((paginaActual * registrosPorPagina) + data.length);
      } else {
        // Si recibimos exactamente registrosPorPagina, asumimos que hay más
        setTotalRegistros((paginaActual + 1) * registrosPorPagina + 1);
      }
    } catch (error) {
      toast.error('Error al cargar los registros');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Confirmación antes de guardar
    const result = await Swal.fire({
      title: '¿Guardar registro?',
      text: '¿Está seguro que desea guardar este registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });
    
    if (!result.isConfirmed) {
      return;
    }
    
    setLoading(true);

    try {
      const signosVitales = `${formulario.tensionArterial ? `Tensión Arterial: ${formulario.tensionArterial}. ` : ''}`
                           + `${formulario.temperatura ? `Temperatura: ${formulario.temperatura}°C. ` : ''}`
                           + `${formulario.frecuenciaCardiaca ? `Frecuencia Cardíaca: ${formulario.frecuenciaCardiaca} bpm. ` : ''}`
                           + `${formulario.frecuenciaRespiratoria ? `Frecuencia Respiratoria: ${formulario.frecuenciaRespiratoria} rpm. ` : ''}`
                           + `${formulario.glucemia ? `Glucemia: ${formulario.glucemia} mg/dL. ` : ''}`
                           + `${formulario.saturacionOxigeno ? `Saturación de Oxígeno: ${formulario.saturacionOxigeno}%.` : ''}`;

      const evolucion = formulario.evolucion.trim();
      const notas = formulario.notas.trim();

      const nuevoRegistro = {
        dniResidente: residenteSeleccionado.dni,
        fecha: fechaActual,
        hora: horaActual,
        turno: turnoActual,
        evolucion: evolucion,
        notas: notas,
        signosVitales: signosVitales.trim()
      };

      await registrosService.create(nuevoRegistro);
      
      toast.success('Registro creado exitosamente');
      
      // Limpiar formulario
      setFormulario({
        evolucion: '',
        notas: '',
        tensionArterial: '',
        temperatura: '',
        frecuenciaCardiaca: '',
        frecuenciaRespiratoria: '',
        glucemia: '',
        saturacionOxigeno: ''
      });
      
      // Actualizar hora al momento actual
      setHoraActual(new Date().toTimeString().slice(0, 5));
      
      setMostrarFormulario(false);
      setPaginaActual(0);
      loadRegistros();
    } catch (error) {
      toast.error('Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  const getTurnoIcon = (turno) => {
    switch (turno) {
      case 'mañana': return 'M';
      case 'tarde': return 'T';
      case 'noche': return 'N';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Selección de residente con tarjetas */}
      {!residenteSeleccionado ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Seleccionar Residente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {residentes.map(residente => (
              <div
                key={residente.id}
                onClick={() => {
                  setResidenteSeleccionado(residente);
                  setPaginaActual(0);
                }}
                className="p-5 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                    <span className="text-primary-700 font-bold text-lg">
                      {residente.nombre[0]}{residente.apellido[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-lg truncate group-hover:text-primary-700 transition-colors">
                      {residente.apellido}, {residente.nombre}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">DNI: {residente.dni}</p>
                    <p className="text-xs text-gray-400 mt-1">{residente.obraSocial}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Botón para volver a selección */}
          <button
            onClick={() => {
              setResidenteSeleccionado(null);
              setMostrarFormulario(false);
            }}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Cambiar residente
          </button>
          {/* Información del residente */}
          <div className="bg-primary-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{residenteSeleccionado.nombre} {residenteSeleccionado.apellido}</h3>
                <p className="text-secondary-50/90 mt-1">DNI: {residenteSeleccionado.dni} • Obra Social: {residenteSeleccionado.obraSocial}</p>
              </div>
              <button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition-colors"
              >
                {mostrarFormulario ? 'Cancelar' : 'Nuevo Registro'}
              </button>
            </div>
          </div>

          {/* Formulario de nuevo registro */}
          {mostrarFormulario && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Nuevo Registro de Enfermería</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fecha, Hora y Turno */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <input
                      type="date"
                      value={fechaActual}
                      onChange={(e) => setFechaActual(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                    <input
                      type="time"
                      value={horaActual}
                      onChange={(e) => setHoraActual(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Turno</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['mañana', 'tarde', 'noche'].map(turno => (
                        <button
                          key={turno}
                          type="button"
                          onClick={() => setTurnoActual(turno)}
                          className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                            turnoActual === turno
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {turno.charAt(0).toUpperCase() + turno.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Signos vitales */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Signos Vitales
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tensión Arterial (TA)</label>
                      <input
                        type="text"
                        value={formulario.tensionArterial}
                        onChange={(e) => setFormulario({...formulario, tensionArterial: e.target.value})}
                        placeholder="120/80"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura (T°)</label>
                      <input
                        type="text"
                        value={formulario.temperatura}
                        onChange={(e) => setFormulario({...formulario, temperatura: e.target.value})}
                        placeholder="36.5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia Cardíaca (FC)</label>
                      <input
                        type="text"
                        value={formulario.frecuenciaCardiaca}
                        onChange={(e) => setFormulario({...formulario, frecuenciaCardiaca: e.target.value})}
                        placeholder="72"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia Respiratoria (FR)</label>
                      <input
                        type="text"
                        value={formulario.frecuenciaRespiratoria}
                        onChange={(e) => setFormulario({...formulario, frecuenciaRespiratoria: e.target.value})}
                        placeholder="16"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Glucemia</label>
                      <input
                        type="text"
                        value={formulario.glucemia}
                        onChange={(e) => setFormulario({...formulario, glucemia: e.target.value})}
                        placeholder="90"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Saturación de Oxígeno</label>
                      <input
                        type="text"
                        value={formulario.saturacionOxigeno}
                        onChange={(e) => setFormulario({...formulario, saturacionOxigeno: e.target.value})}
                        placeholder="98"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Evolución */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evolución *</label>
                  <textarea
                    value={formulario.evolucion}
                    onChange={(e) => setFormulario({...formulario, evolucion: e.target.value})}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    placeholder="Describa la evolución del paciente durante este turno..."
                  />
                </div>

                {/* notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">notas</label>
                  <textarea
                    value={formulario.notas}
                    onChange={(e) => setFormulario({...formulario, notas: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    placeholder="notas adicionales, comentarios o notas especiales..."
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar Registro'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de registros */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Registros Anteriores</h3>
              {registros.length > 0 && (
                <p className="text-sm text-gray-500">
                  Página {paginaActual + 1} - Mostrando {registros.length} registro{registros.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              </div>
            ) : registros.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay registros previos para este residente</p>
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
                          <p className="font-semibold text-gray-800 capitalize">{registro.turno}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(registro.fecha).toLocaleDateString('es-AR', { 
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

                    {/* notas */}
                    {registro.notas && (
                      <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          notas
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
                      onClick={() => setPaginaActual(prev => Math.max(prev - 1, 0))}
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
                      onClick={() => setPaginaActual(prev => prev + 1)}
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
        </>
      )}
    </div>
  );
};

export default Registros;
