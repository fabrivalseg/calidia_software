import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const Login = () => {
  const passwordResetEnabled = import.meta.env.VITE_ENABLE_PASSWORD_RESET === 'true';
  const [mode, setMode] = useState('login'); // login | recover
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [recoveryRequested, setRecoveryRequested] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const clearFeedback = () => {
    setError('');
    setSuccess('');
  };

  const clearSensitiveFields = () => {
    setPassword('');
    setConfirmPassword('');
    setRecoveryToken('');
  };

  const goToMode = (nextMode) => {
    if (nextMode === 'recover' && !passwordResetEnabled) {
      setMode('login');
      setError('La recuperacion de contrasena no esta disponible por el momento.');
      return;
    }

    setMode(nextMode);
    clearFeedback();
    clearSensitiveFields();
    setRecoveryRequested(false);
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    clearFeedback();
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Error al iniciar sesion');
    }

    setLoading(false);
  };

  const handleRequestRecovery = async (e) => {
    e.preventDefault();
    clearFeedback();

    if (!passwordResetEnabled) {
      setError('La recuperacion de contrasena no esta disponible por el momento.');
      return;
    }

    if (!email.trim()) {
      setError('Debes ingresar tu correo electronico');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.requestPasswordReset(email);
      setRecoveryRequested(true);
      setSuccess(response?.message || 'Si el correo existe, recibiras instrucciones de recuperacion.');
      toast.info('Revisa tu correo para continuar con la recuperacion.');
    } catch (err) {
      const errorMsg = err.message || 'No se pudo iniciar la recuperacion';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRecovery = async (e) => {
    e.preventDefault();
    clearFeedback();

    if (!passwordResetEnabled) {
      setError('La recuperacion de contrasena no esta disponible por el momento.');
      return;
    }

    if (!recoveryToken.trim()) {
      setError('Debes ingresar el codigo de recuperacion');
      return;
    }

    if (password.length < 6) {
      setError('La nueva contrasena debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.confirmPasswordReset(recoveryToken, password);
      toast.success(response?.message || 'Contrasena actualizada correctamente');
      setSuccess(response?.message || 'Contrasena actualizada correctamente');

      setPassword('');
      setConfirmPassword('');
      setRecoveryToken('');
      setRecoveryRequested(false);

      setTimeout(() => {
        goToMode('login');
      }, 1200);
    } catch (err) {
      const errorMsg = err.message || 'No se pudo actualizar la contrasena';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary-600 p-8 text-white text-center">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">Residencia Senior Calidia</h1>
            <p className="text-secondary-50/90 text-sm">Sistema de Gestion Institucional</p>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {mode === 'login' && 'Iniciar Sesion'}
              {mode === 'recover' && 'Recuperar Contrasena'}
            </h2>

            {mode === 'login' && (
              <form onSubmit={handleSubmitLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electronico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="correo@ejemplo.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contrasena
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? 'Iniciando sesion...' : 'Ingresar'}
                </button>

                {passwordResetEnabled && (
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => goToMode('recover')}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Olvide mi contrasena
                    </button>
                  </div>
                )}

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    Alta de usuarios solo por administrador.
                  </p>
                </div>
              </form>
            )}

            {mode === 'recover' && passwordResetEnabled && (
              <form
                onSubmit={recoveryRequested ? handleConfirmRecovery : handleRequestRecovery}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="recover-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electronico
                  </label>
                  <input
                    id="recover-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="correo@ejemplo.com"
                    disabled={loading || recoveryRequested}
                  />
                </div>

                {recoveryRequested && (
                  <>
                    <div>
                      <label htmlFor="recover-token" className="block text-sm font-medium text-gray-700 mb-2">
                        Codigo de Recuperacion
                      </label>
                      <input
                        id="recover-token"
                        type="text"
                        value={recoveryToken}
                        onChange={(e) => setRecoveryToken(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="Ingresa el codigo temporal"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="recover-password" className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contrasena
                      </label>
                      <input
                        id="recover-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="Minimo 6 caracteres"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="recover-confirm" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contrasena
                      </label>
                      <input
                        id="recover-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="Repite la contrasena"
                        disabled={loading}
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded text-sm">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading
                    ? 'Procesando...'
                    : recoveryRequested
                      ? 'Actualizar Contrasena'
                      : 'Enviar Codigo de Recuperacion'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => goToMode('login')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Volver a iniciar sesion
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Sistema seguro y profesional para la gestion de residentes
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Problemas para acceder? Contacta al administrador del sistema</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
