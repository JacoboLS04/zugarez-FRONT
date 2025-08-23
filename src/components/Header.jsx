import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="app-title">CRUD App</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <User />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username || 'Usuario'}</span>
              {user?.email && (
                <span className="user-email">{user.email}</span>
              )}
            </div>
          </div>
          
          <div className="header-actions">
            <button className="header-btn" title="Configuración">
              <Settings />
            </button>
            <button 
              className="header-btn logout-btn" 
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
