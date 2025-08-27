import AuthPage from '../auth/AuthPage';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';
import TopBar from '../PaginaPrincipal/TopBar/TopBar';
import Footer from '../PaginaPrincipal/Footer/Footer';
import ProtectedRoute from './../../components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import Header from '../PaginaAdmin/Header/Header';
import AdminPage from '../PaginaAdmin/AdminPage';

function Content() {
  const { user } = useAuth(); // 👈 si hay usuario autenticado

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

      {/* Si SÍ hay sesión => Header + rutas de admin */}
      {user && (
        <>
          <Routes>
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AdminPage />
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
