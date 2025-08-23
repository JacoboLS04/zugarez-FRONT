import React, { useState } from 'react';
import { authService } from '../../services/authService';
import './Login.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowResend(false);
    setResendStatus('');
    try {
      const data = await authService.login(loginData);
      onLogin(data);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('verificar tu correo')) {
        setError('Debes verificar tu correo antes de iniciar sesión.');
        setShowResend(true);
      } else {
        setError(err.message === 'Failed to fetch' ? 'Error de conexión' : err.message);
      }
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendStatus('');
    try {
      await authService.resendVerification(loginData.username);
      setResendStatus('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setResendStatus('No se pudo reenviar el correo.');
    }
  };

  return (
    <div className="login-container">
      {error && <div className="login-error">{error}</div>}
      {showResend && (
        <div style={{ margin: '12px 0', textAlign: 'center' }}>
          <button type="button" className="btn btn-add" onClick={handleResend} disabled={loading}>
            Reenviar correo de verificación
          </button>
          {resendStatus && <div style={{ color: '#2a7ae2', marginTop: '8px' }}>{resendStatus}</div>}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          className="login-input"
          value={loginData.username}
          onChange={e => setLoginData({ ...loginData, username: e.target.value })}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="login-input"
          value={loginData.password}
          onChange={e => setLoginData({ ...loginData, password: e.target.value })}
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn btn-add login-button login-button-primary" 
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <button 
          type="button" 
          className="btn btn-view login-button login-button-secondary" 
          onClick={onSwitchToRegister} 
          disabled={loading}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Login;
