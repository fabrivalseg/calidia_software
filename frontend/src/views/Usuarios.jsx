import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { usuariosService } from '../services/usuariosService';
import { getErrorMessage } from '../services/apiClient';

const initialForm = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  password: '',
  rol: 'ENFERMERO'
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuariosService.getAll();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudieron cargar los usuarios'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    const result = await Swal.fire({
      title: 'Confirmar alta',
      text: `Se creara el usuario ${form.email} con rol ${form.rol}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, crear usuario',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    setSaving(true);
    try {
      await usuariosService.create(form);
      toast.success('Usuario creado correctamente');
      setForm(initialForm);
      await loadUsuarios();
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo crear el usuario'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Alta de Usuario</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            placeholder="Nombre"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            required
          />
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={onChange}
            placeholder="Apellido"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="correo@ejemplo.com"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            required
          />
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={onChange}
            placeholder="Telefono"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Contrasena (minimo 6)"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            minLength={6}
            required
          />
          <select
            name="rol"
            value={form.rol}
            onChange={onChange}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
            required
          >
            <option value="ENFERMERO">Enfermero/a</option>
            <option value="MEDICO">Medico/a</option>
            <option value="ADMIN">Administrativo/Director</option>
          </select>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Usuarios del Sistema</h3>

        {loading ? (
          <p className="text-gray-600">Cargando usuarios...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2">Nombre</th>
                <th className="py-2">Email</th>
                <th className="py-2">Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.email} className="border-b border-gray-100">
                  <td className="py-2">{usuario.nombre} {usuario.apellido}</td>
                  <td className="py-2">{usuario.email}</td>
                  <td className="py-2">{usuario.rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
