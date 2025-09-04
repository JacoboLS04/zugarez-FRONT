import React, { useState } from 'react';
import { authService } from '../../../services/authService';
import './Register.css';

const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!registerData.username || !registerData.email || !registerData.password) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(registerData.email)) {
      setError('Email inválido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      await authService.register(registerData);
      onRegisterSuccess(registerData.username, registerData.password);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Error de conexión' : err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      {error && <div className="register-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          className="register-input"
          value={registerData.username}
          onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          className="register-input"
          value={registerData.email}
          onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="register-input"
          value={registerData.password}
          onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn btn-add register-button register-button-primary" 
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        <button 
          type="button" 
          className="btn btn-view register-button register-button-secondary" 
          onClick={onSwitchToLogin} 
          disabled={loading}
        >
          Volver a login
        </button>
      </form>
    </div>
  );
};

export default Register;
