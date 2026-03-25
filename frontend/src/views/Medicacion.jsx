import { useState, useEffect } from 'react';
import { medicacionService } from '../services/medicacionService';
import { residentesService } from '../services/residentesService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getErrorMessage, isUnauthorized } from '../services/apiClient';

const Medicacion = () => {
  const [residentes, setResidentes] = useState([]);
  const [residenteSeleccionado, setResidenteSeleccionado] = useState(null);
  const [medicaciones, setMedicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [medicacionEditando, setMedicacionEditando] = useState(null);
  
  const [formulario, setFormulario] = useState({
    nombre: '',
    momento: '',
    hora: '',
    cantidad: '',
    tipo: 'REGULAR'
  });
  const [formErrors, setFormErrors] = useState({});

  const formularioInicial = {
    nombre: '',
    momento: '',
    hora: '',
    cantidad: '',
    tipo: 'REGULAR'
  };

  const momentosOpciones = [
    'Ayuno',
    'Desayuno',
    'Merienda',
    'Cena',
    'Complementos/Otros'
  ];

  useEffect(() => {
    loadResidentes();
  }, []);

  useEffect(() => {
    if (residenteSeleccionado) {
      loadMedicacion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residenteSeleccionado]);

  const loadResidentes = async () => {
    const data = await residentesService.getAll();
    setResidentes(data);
  };

  const loadMedicacion = async () => {
    setLoading(true);
    try {
      const data = await medicacionService.getByResidente(residenteSeleccionado.dni);
      setMedicaciones(data);
    } catch (error) {
      if (!isUnauthorized(error)) toast.error(getErrorMessage(error, 'No se pudo cargar la medicacion'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formulario.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formulario.momento) errors.momento = 'El momento es requerido';
    if (!formulario.hora) errors.hora = 'La hora es requerida';
    if (!formulario.cantidad.trim()) {
      errors.cantidad = 'La cantidad/dosis es requerida';
    } else if (formulario.cantidad.trim().length > 50) {
      errors.cantidad = 'La cantidad/dosis no puede superar 50 caracteres';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Confirmación antes de guardar o editar
    const result = await Swal.fire({
      title: medicacionEditando ? '¿Actualizar medicación?' : '¿Agregar medicación?',
      html: `<p>${medicacionEditando ? '¿Está seguro que desea actualizar' : '¿Está seguro que desea agregar'} la medicación:</p><strong>${formulario.nombre}</strong><p>Momento: ${formulario.momento} - ${formulario.hora}</p><p>Cantidad: ${formulario.cantidad}</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#6b7280',
      confirmButtonText: medicacionEditando ? 'Sí, actualizar' : 'Sí, agregar',
      cancelButtonText: 'Cancelar'
    });
    
    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);
    try {
      const medicacionData = {
        ...formulario,
        cantidad: formulario.cantidad.trim(),
        dniResidente: residenteSeleccionado.dni,
      };

      if (medicacionEditando) {
        await medicacionService.update(medicacionEditando.id, medicacionData);
        toast.success('Medicación actualizada exitosamente');
      } else {
        await medicacionService.create(medicacionData);
        toast.success('Medicación agregada exitosamente');
      }
      
      await loadMedicacion();
      handleCancelForm();
    } catch (error) {
      if (!isUnauthorized(error)) {
        const msg = getErrorMessage(error, 'No se pudo guardar la medicacion');
        toast.error(msg);
        setFormErrors({ submit: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicacion) => {
    setMedicacionEditando(medicacion);
    setFormulario({
      nombre: medicacion.nombre,
      momento: medicacion.momento,
      hora: medicacion.hora,
      cantidad: medicacion.cantidad,
      tipo: medicacion.tipo
    });
    setFormErrors({});
    setMostrarFormulario(true);
  };

  const handleOpenAddForm = () => {
    setMedicacionEditando(null);
    setFormulario(formularioInicial);
    setFormErrors({});
    setMostrarFormulario(true);
  };

  const handleToggleFormulario = () => {
    if (mostrarFormulario) {
      handleCancelForm();
      return;
    }
    handleOpenAddForm();
  };

  const handleCancelForm = () => {
    setMostrarFormulario(false);
    setMedicacionEditando(null);
    setFormulario(formularioInicial);
    setFormErrors({});
  };

  const agruparPorMomento = () => {
    const grupos = {};
    medicaciones.forEach(med => {
      if (!grupos[med.momento]) {
        grupos[med.momento] = [];
      }
      grupos[med.momento].push(med);
    });
    return grupos;
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'REGULAR': return 'bg-blue-100 text-blue-700';
      case 'EXTRA': return 'bg-orange-100 text-orange-700';
      case 'SOS': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
                key={residente.dni}
                onClick={() => setResidenteSeleccionado(residente)}
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
              setMedicacionEditando(null);
            }}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Cambiar residente
          </button>
          {/* Información del residente con botón agregar */}
          <div className="bg-primary-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{residenteSeleccionado.nombre} {residenteSeleccionado.apellido}</h3>
                <p className="text-secondary-50/90 mt-1">DNI: {residenteSeleccionado.dni}</p>
              </div>
              <button
                onClick={handleToggleFormulario}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {mostrarFormulario ? 'Cancelar' : 'Agregar Medicación'}
              </button>
            </div>
          </div>

          {/* Formulario de medicación */}
          {mostrarFormulario && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {medicacionEditando ? 'Editar Medicación' : 'Nueva Medicación'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Medicamento *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                      placeholder="Ej: Enalapril, Paracetamol..."
                    />
                    {formErrors.nombre && <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>}
                  </div>

                  {/* Momento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Momento *
                    </label>
                    <select
                      name="momento"
                      value={formulario.momento}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.momento ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white`}
                    >
                      <option value="">Seleccione...</option>
                      {momentosOpciones.map(momento => (
                        <option key={momento} value={momento}>{momento}</option>
                      ))}
                    </select>
                    {formErrors.momento && <p className="text-red-500 text-sm mt-1">{formErrors.momento}</p>}
                  </div>

                  {/* Hora */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora *
                    </label>
                    <input
                      type="time"
                      name="hora"
                      value={formulario.hora}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.hora ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    />
                    {formErrors.hora && <p className="text-red-500 text-sm mt-1">{formErrors.hora}</p>}
                  </div>

                  {/* Cantidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad/Dosis *
                    </label>
                    <input
                      type="text"
                      name="cantidad"
                      value={formulario.cantidad}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.cantidad ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                      placeholder="Ej: 1 comprimido, medio comprimido, 5 ml"
                    />
                    {formErrors.cantidad && <p className="text-red-500 text-sm mt-1">{formErrors.cantidad}</p>}
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      name="tipo"
                      value={formulario.tipo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="REGULAR">REGULAR</option>
                      <option value="EXTRA">EXTRA</option>
                      <option value="SOS">SOS</option>
                    </select>
                  </div>
                </div>

                {/* Error general */}
                {formErrors.submit && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded">
                    {formErrors.submit}
                  </div>
                )}

                {/* Botones */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 shadow-md"
                  >
                    {loading ? 'Guardando...' : (medicacionEditando ? 'Actualizar' : 'Guardar Medicación')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Plan de medicación mejorado */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Plan de Medicación</h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              </div>
            ) : medicaciones.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="text-gray-500">No hay medicación registrada</p>
                <p className="text-sm text-gray-400 mt-2">Agregue la primera medicación para este residente</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(agruparPorMomento()).map(([momento, meds]) => (
                  <div key={momento} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                      <h4 className="font-bold text-white text-lg">{momento}</h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {meds.map(medicacion => (
                        <div key={medicacion.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h5 className="font-bold text-gray-800 text-lg">{medicacion.nombre}</h5>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getTipoColor(medicacion.tipo)}`}>
                                  {medicacion.tipo}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <div>
                                    <p className="text-xs text-gray-500">Hora</p>
                                    <p className="font-semibold text-gray-800">{medicacion.hora}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                  <div>
                                    <p className="text-xs text-gray-500">Cantidad</p>
                                    <p className="font-semibold text-gray-800">{medicacion.cantidad}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div>
                                    <p className="text-xs text-gray-500">Momento</p>
                                    <p className="font-semibold text-gray-800">{medicacion.momento}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleEdit(medicacion)}
                              className="ml-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Medicacion;
