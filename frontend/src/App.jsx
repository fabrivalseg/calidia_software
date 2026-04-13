import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './views/Login';
import Layout from './components/Layout';
import Inicio from './views/Inicio';
import Residentes from './views/Residentes';
import Registros from './views/Registros';
import Medicacion from './views/Medicacion';
import Historial from './views/Historial';
import Usuarios from './views/Usuarios';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('inicio');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'inicio':
        return <Inicio />;
      case 'residentes':
        return <Residentes />;
      case 'registros':
        return <Registros />;
      case 'medicacion':
        return <Medicacion />;
      case 'historial':
        return <Historial />;
      case 'usuarios':
        return <Usuarios />;
      default:
        return <Inicio />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;
