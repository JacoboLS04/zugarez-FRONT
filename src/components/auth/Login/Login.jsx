import React, { useState } from 'react';
import { authService } from '../../../services/authService';
import './Login.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleLoginInit = async (e) => {
    e.preventDefault();
    console.log('handleLoginInit called');
    setLoading(true);
    setError('');
    setShowResend(false);
    setResendStatus('');
    try {
      const res = await authService.loginInit(loginData.username, loginData.password);
      console.log('Respuesta loginInit:', res);
      if (res.message && res.message.toLowerCase().includes('código enviado')) {
        setShowCodeInput(true);
      } else {
        setError(res.message || 'Error de login');
      }
    } catch (err) {
      setError('Error de conexión');
    }
    setLoading(false);
    console.log('handleLoginInit finished');
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.verifyLoginCode(loginData.username, code);
      if (res.token) {
        localStorage.setItem('token', res.token);
        if (onLogin) onLogin(res);
      } else {
        setError(res.message || 'Código incorrecto');
      }
    } catch (err) {
      setError('Error de conexión');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendStatus('');
    try {
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
      <form onSubmit={showCodeInput ? handleVerifyCode : handleLoginInit}>
        <input
          type="text"
          placeholder="Usuario"
          className="login-input"
          value={loginData.username}
          onChange={e => setLoginData({ ...loginData, username: e.target.value })}
          required
          disabled={loading || showCodeInput}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="login-input"
          value={loginData.password}
          onChange={e => setLoginData({ ...loginData, password: e.target.value })}
          required
          disabled={loading || showCodeInput}
        />
        {showCodeInput && (
          <div className="code-input-modal">
            <label htmlFor="code">Ingresa el código recibido por email:</label>
            <input
              type="text"
              id="code"
              maxLength={2}
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              className="login-input"
              disabled={loading}
            />
          </div>
        )}
        <button 
          type="submit" 
          className="btn btn-add login-button login-button-primary" 
          disabled={loading}
        >
          {loading ? 'Procesando...' : showCodeInput ? 'Verificar código' : 'Entrar'}
        </button>
        {!showCodeInput && (
          <button 
            type="button" 
            className="btn btn-view login-button login-button-secondary" 
            onClick={onSwitchToRegister} 
            disabled={loading}
          >
            Registrarse
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
