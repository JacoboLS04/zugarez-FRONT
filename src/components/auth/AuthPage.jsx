import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setError('Por favor completa todos los campos');
        return false;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        setError('Todos los campos son obligatorios');
        return false;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
        setError('Email inválido');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setShowResend(false);
    setResendStatus('');
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        await login({
          username: formData.username,
          password: formData.password
        });
        // El contexto de autenticación manejará la redirección
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        setIsLogin(true);
        setFormData({ username: formData.username, email: '', password: formData.password });
        setError('');
      }
    } catch (err) {
  setError(err.message || 'Error de autenticación');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-page" id="authPage">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              <User />
              {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
            </h1>
            <p className="auth-subtitle">
              {isLogin ? 'Inicia sesión en tu cuenta' : 'Únete a nuestra comunidad'}
            </p>
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {error}
            </div>
          )}

          <div className="auth-form">
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleInputChange}
                className="auth-input"
              />
            </div>

            {!isLogin && (
              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-input"
                />
              </div>
            )}

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className="auth-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading && <span className="loading-spinner"></span>}
              {isLoading ? (isLogin ? 'Iniciando...' : 'Registrando...') : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </div>

          <div className="auth-switch">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
