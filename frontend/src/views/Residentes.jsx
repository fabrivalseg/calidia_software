import { useState, useEffect } from 'react';
import { residentesService } from '../services/residentesService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getErrorMessage, isUnauthorized } from '../services/apiClient';

const Residentes = ({ onSelectResidente }) => {
  const [residentes, setResidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResidente, setSelectedResidente] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    fechaIngreso: '',
    obraSocial: '',
    nombreFamiliar: '',
    apellidoFamiliar: '',
    parentesco: '',
    telefonoFamiliar: '',
    medico: '',
    patologias: '',
    medicacion: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  

  useEffect(() => {
    loadResidentes();
  }, []);

  const loadResidentes = async () => {
    setLoading(true);
    try {
      const data = await residentesService.getAll();
      setResidentes(data);
    } catch (error) {
      if (!isUnauthorized(error)) toast.error(getErrorMessage(error, 'No se pudieron cargar los residentes'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim() !== '' ) {
      const results = await residentesService.search(residentes,value);
      setResidentes(results);
    } else {
      loadResidentes()
    }
  };

  const handleSelectResidente = (residente) => {
    setSelectedResidente(residente);
    if (onSelectResidente) {
      onSelectResidente(residente);
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) errors.apellido = 'El apellido es requerido';
    if (!formData.dni.trim()) errors.dni = 'El DNI es requerido';
    if (!formData.fechaNacimiento) errors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.fechaIngreso) errors.fechaIngreso = 'La fecha de ingreso es requerida';
    if (!formData.obraSocial.trim()) errors.obraSocial = 'La obra social es requerida';
    if (!formData.nombreFamiliar.trim()) errors.nombreFamiliar = 'El nombre del familiar es requerido';
    if (!formData.apellidoFamiliar.trim()) errors.apellidoFamiliar = 'El apellido del familiar es requerido';
    if (!formData.parentesco.trim()) errors.parentesco = 'El parentesco es requerido';
    if (!formData.telefonoFamiliar.trim()) errors.telefonoFamiliar = 'El teléfono es requerido';
    if (!formData.medico.trim()) errors.medico = 'El médico de cabecera es requerido';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Confirmación antes de guardar
    const result = await Swal.fire({
      title: '¿Registrar residente?',
      html: `<p>¿Está seguro que desea registrar a:</p><strong>${formData.nombre} ${formData.apellido}</strong><p>DNI: ${formData.dni}</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    });
    
    if (!result.isConfirmed) {
      return;
    }

    setSubmitting(true);
    
    try {
      const nuevoResidente = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        fechaNacimiento: formData.fechaNacimiento,
        fechaIngreso: formData.fechaIngreso,
        obraSocial: formData.obraSocial,
        nombreFamiliar: formData.nombreFamiliar,
        apellidoFamiliar: formData.apellidoFamiliar,
        parentescoFamiliar: formData.parentesco,
        telefonoFamiliar: formData.telefonoFamiliar,
        medico: formData.medico,
        patologias: formData.patologias,
        medicacion: formData.medicacion
      };

      await residentesService.create(nuevoResidente);
      
      toast.success('Residente registrado exitosamente');
      
      await loadResidentes();
      
      // Cerrar formulario y limpiar
      setShowForm(false);
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        fechaIngreso: '',
        obraSocial: '',
        nombreFamiliar: '',
        apellidoFamiliar: '',
        parentesco: '',
        telefonoFamiliar: '',
        medico: '',
        patologias: '',
        medicacion: ''
      });
      
    } catch (error) {
        if (!isUnauthorized(error)) {
          const msg = getErrorMessage(error, 'No se pudo registrar el residente');
          toast.error(msg);
          setFormErrors({ submit: msg });
        }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelForm = async () => {
    // Verificar si hay datos completados
    const hayDatos = Object.values(formData).some(value => value !== '');
    
    if (hayDatos) {
      const result = await Swal.fire({
        title: '¿Cancelar registro?',
        text: 'Se perderán todos los datos ingresados. ¿Está seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, continuar editando'
      });
      
      if (!result.isConfirmed) {
        return;
      }
    }
    
    setShowForm(false);
    setFormData({
      nombre: '',      apellido: '',      dni: '',
      fechaNacimiento: '',
      fechaIngreso: '',
      obraSocial: '',
      nombreFamiliar: '',
      apellidoFamiliar: '',
      parentesco: '',
      telefonoFamiliar: '',
      medico: '',
      patologias: '',
      medicacion: ''
    });
    setFormErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Buscador y botón nuevo residente */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o DNI..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Residente
          </button>
        </div>
      </div>

      {/* Formulario de nuevo residente */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Registrar Nuevo Residente</h3>
            <button
              onClick={handleCancelForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div>
              <h4 className="font-semibold text-lg text-gray-700 border-b pb-2 mb-4">Información Personal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    placeholder="María"
                  />
                  {formErrors.nombre && <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.apellido ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    placeholder="González"
                  />
                  {formErrors.apellido && <p className="text-red-500 text-sm mt-1">{formErrors.apellido}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI *
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.dni ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    placeholder="12345678"
                  />
                  {formErrors.dni && <p className="text-red-500 text-sm mt-1">{formErrors.dni}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                  />
                  {formErrors.fechaNacimiento && <p className="text-red-500 text-sm mt-1">{formErrors.fechaNacimiento}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Ingreso *
                  </label>
                  <input
                    type="date"
                    name="fechaIngreso"
                    value={formData.fechaIngreso}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.fechaIngreso ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                  />
                  {formErrors.fechaIngreso && <p className="text-red-500 text-sm mt-1">{formErrors.fechaIngreso}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Obra Social *
                  </label>
                  <input
                    type="text"
                    name="obraSocial"
                    value={formData.obraSocial}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.obraSocial ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    placeholder="PAMI, OSDE, Swiss Medical, etc."
                  />
                  {formErrors.obraSocial && <p className="text-red-500 text-sm mt-1">{formErrors.obraSocial}</p>}
                </div>
              </div>
            </div>

            {/* Contacto Familiar */}
            <div>
              <h4 className="font-semibold text-lg text-gray-700 border-b pb-2 mb-4">Contacto Familiar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Familiar *
                  </label>
                  <input
                    type="text"
                    name="nombreFamiliar"
                    value={formData.nombreFamiliar}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.nombreFamiliar ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    placeholder="Juan"
                  />
                  {formErrors.nombreFamiliar && <p className="text-red-500 text-sm mt-1">{formErrors.nombreFamiliar}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido del Familiar *
                  </label>
                  <input
                    type="text"
                    name="apellidoFamiliar"
                    value={formData.apellidoFamiliar}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.apellidoFamiliar ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    placeholder="Pérez"
                  />
                  {formErrors.apellidoFamiliar && <p className="text-red-500 text-sm mt-1">{formErrors.apellidoFamiliar}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parentesco *
                  </label>
                  <select
                    name="parentesco"
                    value={formData.parentesco}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.parentesco ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white`}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Hijo/a">Hijo/a</option>
                    <option value="Nieto/a">Nieto/a</option>
                    <option value="Hermano/a">Hermano/a</option>
                    <option value="Sobrino/a">Sobrino/a</option>
                    <option value="Cónyuge">Cónyuge</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {formErrors.parentesco && <p className="text-red-500 text-sm mt-1">{formErrors.parentesco}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefonoFamiliar"
                    value={formData.telefonoFamiliar}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.telefonoFamiliar ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    placeholder="351-1234567"
                  />
                  {formErrors.telefonoFamiliar && <p className="text-red-500 text-sm mt-1">{formErrors.telefonoFamiliar}</p>}
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div>
              <h4 className="font-semibold text-lg text-gray-700 border-b pb-2 mb-4">Información Médica</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Médico de Cabecera *
                  </label>
                  <input
                    type="text"
                    name="medico"
                    value={formData.medico}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.medico ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`}
                    placeholder="Dr. Juan Pérez"
                  />
                  {formErrors.medico && <p className="text-red-500 text-sm mt-1">{formErrors.medico}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patologías Crónicas
                  </label>
                  <textarea
                    name="patologias"
                    value={formData.patologias}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    placeholder="Ej: Hipertensión arterial, Diabetes tipo 2, Alzheimer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicacion
                  </label>
                  <textarea
                    name="medicacion"
                    value={formData.medicacion}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    placeholder="Ej: Antihipertensivos, diuréticos, analgésicos..."
                  />
                </div>
              </div>
            </div>

            {/* Error general */}
            {formErrors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded">
                {formErrors.submit}
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? 'Registrando...' : 'Registrar Residente'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de residentes */}
      {residentes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500">No se encontraron residentes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {residentes.map((residente) => (
            <div
              key={residente.dni}
              onClick={() => handleSelectResidente(residente)}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ${
                selectedResidente?.id === residente.id ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="bg-primary-600 p-4 text-white">
                <h3 className="text-xl font-bold">{residente.nombre} {residente.apellido}</h3>
                <p className="text-sm text-secondary-50/90">DNI: {residente.dni}</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Edad:</span>
                  <span className="font-medium">{calcularEdad(residente.fechaNacimiento)} años</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Fecha de Ingreso:</span>
                  <span className="font-medium">{new Date(residente.fechaIngreso).toLocaleDateString('es-AR')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Obra Social:</span>
                  <span className="font-medium">{residente.obraSocial}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Médico:</span>
                  <span className="font-medium text-xs">{residente.medico}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detalle del residente seleccionado */}
      {selectedResidente && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Información Detallada</h3>
            <button
              onClick={() => setSelectedResidente(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-700 border-b pb-2">Información Personal</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Nombre Completo</label>
                  <p className="font-medium">{selectedResidente.nombre} {selectedResidente.apellido}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">DNI</label>
                  <p className="font-medium">{selectedResidente.dni}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Fecha de Nacimiento</label>
                  <p className="font-medium">{new Date(selectedResidente.fechaNacimiento).toLocaleDateString('es-AR')}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Fecha de Ingreso</label>
                  <p className="font-medium">{new Date(selectedResidente.fechaIngreso).toLocaleDateString('es-AR')}</p>
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-700 border-b pb-2">Información Médica</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Obra Social</label>
                  <p className="font-medium">{selectedResidente.obraSocial}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Médico de Cabecera</label>
                  <p className="font-medium">{selectedResidente.medico}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Patologías Crónicas</label>
                  <p className="font-medium text-sm">{selectedResidente.patologias || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Medicación</label>
                  <p className="font-medium text-sm">{selectedResidente.medicacion || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Contacto Familiar */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-semibold text-lg text-gray-700 border-b pb-2">Contacto Familiar</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Nombre</label>
                  <p className="font-medium">{selectedResidente.familiar.nombre} {selectedResidente.familiar.apellido}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Parentesco</label>
                  <p className="font-medium">{selectedResidente.familiar.parentesco}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Teléfono</label>
                  <p className="font-medium">{selectedResidente.familiar.telefono}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Residentes;
