import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPage.css';
//TODO: Este componente tiene un pequeño bug, al iniciar sesión con correo,



//TODO: Also, si entro con el usuario, me manda codigo pero no deja ingresar el codigo
const AuthPage = () => {
  const { login, register, loginVerifyCode } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [userType, setUserType] = useState('client'); // Default to client
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  // Maneja cambios en los inputs
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  // Maneja cambios en el tipo de usuario
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  // Validación de formulario
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
    // Maneja la verificación del código
    const handleVerifyCode = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      try {
        // Usar el email guardado durante el login init
        const res = await authService.verifyCodeFlexible(loginEmail, code, 'email');
        if (res.token) {
          // El backend ya devuelve el JWT completo, solo guardarlo
          localStorage.setItem('token', res.token);
          if (res.user) {
            // Guardar el usuario con el tipo seleccionado
            const userData = {...res.user, userType};
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          // Recargar la página para que el contexto se actualice
          window.location.reload();
        } else {
          setError(res.message || 'Código incorrecto');
        }
      } catch (err) {
        setError(err.message || 'Error al verificar el código');
      }
      setIsLoading(false);
    };

    // Maneja el submit del login/registro
    const handleSubmit = async (e) => {
      e && e.preventDefault();
      setIsLoading(true);
      setError('');
      setShowCodeInput(false);

      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      try {
        if (isLogin) {
          // Detectar si es email o username
          const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.username);
          let identifier = formData.username;
          let bodyKey = isEmail ? 'email' : 'username';
          
          const res = await authService.loginInitFlexible(identifier, formData.password, bodyKey);
          if (res.message && res.message.toLowerCase().includes('código enviado')) {
            // Guardar el identificador usado para la verificación
            if (isEmail) {
              setLoginEmail(identifier); // Es email, guardarlo directamente
            } else {
              // Es username, pero necesitamos el email para verificar código
              // El backend debería devolver el email en la respuesta
              setError('Inicia sesión con tu email para recibir el código de verificación');
              setIsLoading(false);
              return;
            }
            setShowCodeInput(true);
          } else if (res.token) {
            const loginResult = await login({ 
              username: formData.username, 
              password: formData.password 
            });
            
            // Guardar userType en localStorage
            if (loginResult && loginResult.user) {
              const userData = {...loginResult.user, userType};
              localStorage.setItem('user', JSON.stringify(userData));
            } else {
              // Si no hay respuesta específica, intentar guardar userType con el usuario actual
              const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
              localStorage.setItem('user', JSON.stringify({...currentUser, userType}));
            }
          } else {
            setError(res.message || 'Error de login');
          }
        } else {
          const registerData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            userType: userType // Incluir el tipo de usuario
          };
          await register(registerData);
          setIsLogin(true);
          setFormData({ username: formData.username, email: '', password: formData.password });
          setError('');
        }
      } catch (err) {
        setError(err.message || 'Error de autenticación');
      }
      setIsLoading(false);
    };

    // Render principal
    return (
      <div className="auth-page" id="login">
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
              {showCodeInput ? (
                <form onSubmit={handleVerifyCode} className="code-form">
                  <label htmlFor="code">Ingresa el código recibido por email:</label>
                  <input
                    type="text"
                    id="code"
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                    className="login-input"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={isLoading}
                  >
                    Verificar código
                  </button>
                </form>
              ) : isLogin ? (
                <form onSubmit={handleSubmit} className='formularioInicioSesion'>
                  <div className="input-group">
                    <User className="input-icon" />
                    <input
                      className='auth-input'
                      type="text"
                      name="username"
                      placeholder="Usuario o Email"
                      value={formData.username}
                      onChange={handleInputChange}
                      autoComplete="username"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <Lock className="input-icon" />
                    <input
                      className='auth-input'
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  
                  {/* Radio buttons para seleccionar tipo de usuario */}
                  <div className="user-type-selection">
                    <label className="radio-container">
                      <input
                        type="radio"
                        name="userType"
                        value="client"
                        checked={userType === 'client'}
                        onChange={handleUserTypeChange}
                      />
                      <span className="radio-label">Cliente.</span>
                    </label>

                
                    

                    <label className="radio-container">
                      <input
                        type="radio"
                        name="userType"
                        value="admin"
                        checked={userType === 'admin'}
                        onChange={handleUserTypeChange}
                      />
                      <span className="radio-label">Administrador</span>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={isLoading}
                  >
                    Entrar
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="formularioRegistro">
                    <div className="input-group">
                      <UserPlus className="input-icon" />
                      <input
                        className="auth-input"
                        type="text"
                        name="username"
                        placeholder="Usuario"
                        value={formData.username}
                        onChange={handleInputChange}
                        autoComplete="username"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <Mail className="input-icon" />
                      <input
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <Lock className="input-icon" />
                      <input
                        className="auth-input"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    
                    {/* Radio buttons para seleccionar tipo de usuario en registro */}
                    <div className="user-type-selection">
                      <label className="radio-container">
                        <input
                          type="radio"
                          name="userType"
                          value="client"
                          checked={userType === 'client'}
                          onChange={handleUserTypeChange}
                        />
                        <span className="radio-label">Cliente</span>
                      </label>
                      <label className="radio-container">
                        <input
                          type="radio"
                          name="userType"
                          value="admin"
                          checked={userType === 'admin'}
                          onChange={handleUserTypeChange}
                        />
                        <span className="radio-label">Administrador</span>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      className="auth-submit-btn"
                      disabled={isLoading}
                    >
                      Registrarse
                    </button>
                </form>
              )}
            </div>

            <div className="auth-switch">
              {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default AuthPage;
