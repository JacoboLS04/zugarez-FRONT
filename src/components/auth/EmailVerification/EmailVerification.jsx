import React, { useEffect, useState } from 'react';

const API_URL = '/auth/verify-email';

const EmailVerification = () => {
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado.');
      return;
    }
    fetch(`${API_URL}?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.message && data.status === 'OK') {
          setStatus('success');
          setMessage('¡Tu correo ha sido verificado correctamente! Ya puedes iniciar sesión.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Token inválido o expirado.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Error al verificar el correo.');
      });
  }, []);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 12px #ccc', padding: '32px', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: status === 'success' ? '#2a7ae2' : '#e22a2a' }}>
          {status === 'success' ? '¡Correo verificado!' : 'Verificación de correo'}
        </h2>
        <p style={{ margin: '18px 0', color: '#555' }}>{message}</p>
        {status === 'success' && (
          <a href="/login" style={{ display: 'inline-block', marginTop: '16px', padding: '12px 24px', background: '#2a7ae2', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
            Ir al login
          </a>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
