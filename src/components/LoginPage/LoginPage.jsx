import AuthPage from '../auth/AuthPage';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';
import TopBar from '../PaginaPrincipal/TopBar/TopBar';
import Footer from '../PaginaPrincipal/Footer/Footer';
import ProtectedRoute from './../../components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import Header from '../PaginaAdmin/Header/Header';
import AdminPage from '../PaginaAdmin/AdminPage';
import ClientePage from '../ClientShopping/ClientePage';

function Content() {
  const { user } = useAuth(); // 👈 si hay usuario autenticado
  
  // Obtener el tipo de usuario desde localStorage o usar el valor del contexto
  const getUserType = () => {
    if (!user) return null;
    
    try {
      // Intentar obtener userType desde localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      return storedUser.userType || 'client'; // Default a cliente si no hay tipo especificado
    } catch (error) {
      console.error('Error al obtener tipo de usuario:', error);
      return 'client'; // Default a cliente en caso de error
    }
  };
  
  const userType = getUserType();

  return (
    <div className="login-page">
      {/* Si NO hay sesión => TopBar + formulario */}
      {!user && (
        <>
          <TopBar />
          <AuthPage />
          <Footer />
        </>
      )}

      {/* Si SÍ hay sesión => Header + rutas según el tipo de usuario */}
      {user && (
        <>
          <Routes>
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  {userType === 'admin' ? <AdminPage /> : <ClientePage />}
                </ProtectedRoute>
              }
            />
          </Routes>
        </>
      )}
    </div>
  );
}

function LoginPage() {
  return (
    <AuthProvider>
      <Content />
    </AuthProvider>
  );
}

export default LoginPage;
