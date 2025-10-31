import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { username, rol, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'RRHH'] },
    { path: '/empleados', label: 'Empleados', icon: '👥', roles: ['ADMIN', 'RRHH'] },
    { path: '/asistencia', label: 'Asistencia', icon: '⏰', roles: ['ADMIN', 'RRHH', 'EMPLEADO'] },
    { path: '/nomina', label: 'Nómina', icon: '💰', roles: ['ADMIN', 'RRHH'] }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(rol || '')
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-600">Sistema de Nómina</h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6">
              {filteredMenuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-800">{username}</p>
                <p className="text-xs text-gray-600">{rol}</p>
              </div>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden pb-4 border-t pt-4">
              {filteredMenuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-lg mb-2 transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2024 Sistema de Gestión de Nómina. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
