import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { setUnauthorizedHandler } from '../services/apiClient';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const expirationToastShownRef = useRef(false);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      localStorage.removeItem('user');
      if (!expirationToastShownRef.current) {
        expirationToastShownRef.current = true;
        toast.warning('Tu sesion expiro. Por favor volve a iniciar sesion.');
      }
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  useEffect(() => {
    // Verificar si hay una sesión activa (cookie válida)
    const checkSession = async () => {
      try {
        const userData = await authService.verifySession();
        if (userData) {
          expirationToastShownRef.current = false;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          // Si había una sesión previa guardada, significa que expiró
          const hadSession = localStorage.getItem('user');
          localStorage.removeItem('user');
          if (hadSession) {
            expirationToastShownRef.current = true;
            toast.warning('Tu sesion expiro. Por favor volve a iniciar sesion.');
          }
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      expirationToastShownRef.current = false;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Bienvenido`);
      return { success: true };
    } catch (error) {
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      toast.info('Sesion cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
