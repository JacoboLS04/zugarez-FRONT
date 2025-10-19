import React, { useState } from 'react';
import api from '../../services/api';

const Unsubscribe = () => {
  const [form, setForm] = useState({ reason: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reason = String(form.reason || '').trim();

    // Validaciones: motivo obligatorio 10-500 caracteres
    if (!reason || reason.length < 10) {
      alert('El motivo debe tener al menos 10 caracteres');
      return;
    }
    if (reason.length > 500) {
      alert('El motivo no puede superar los 500 caracteres');
      return;
    }

    if (!window.confirm('¿Confirmas que deseas solicitar la baja?')) return;

    setSending(true);
    try {
      // intentar obtener token y user desde localStorage
      const token = localStorage.getItem('token');
      let userName = '';
      let userEmail = '';
      try {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          const parsed = JSON.parse(userRaw);
          userName = parsed?.name || parsed?.username || '';
          userEmail = parsed?.email || '';
        }
      } catch (err) {
        // ignore parse errors
      }

      const body = {
        name: userName || '',
        email: userEmail || '',
        reason,
      };


      try {
        const response = await api.post('/api/unsubscribe', body);
        // axios resolves for 2xx
        if (response && (response.status === 200 || response.status === 201)) {
          // ✅ 200 OK: logout obligado por especificación
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          try { sessionStorage.clear(); } catch (e) {}

          alert('Tu solicitud de baja ha sido procesada correctamente.');
          // redirigir al login indicando baja voluntaria
          window.location.href = '/login?unsubscribed=true';
          return;
        }
      } catch (err) {
        // axios error handling
        if (err.response) {
          const status = err.response.status;
          const data = err.response.data || {};
          if (status === 400) {
            alert(data.details?.reason || data.message || 'Datos inválidos');
          } else if (status === 409) {
            alert('Tu cuenta ya está dada de baja');
          } else if (status === 403) {
            // el backend bloqueó al usuario: limpiar y redirigir
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            try { sessionStorage.clear(); } catch (e) {}
            alert('Tu cuenta ha sido desactivada');
            window.location.href = '/login?deactivated=true';
          } else {
            console.error('unsubscribe failed', status, err.response.data);
            alert('Error al procesar la solicitud');
          }
        } else {
          console.error(err);
          alert('Ocurrió un error al enviar la solicitud.');
        }
      }

      // limpiar formulario
      setForm({ reason: '' });
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al enviar la solicitud.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="unsubscribe-form" aria-labelledby="unsubscribe-title">
      <h2 id="unsubscribe-title">Solicitar baja</h2>
      <p className="muted">Completa el formulario para solicitar la eliminación de tus datos.</p>

      <form onSubmit={handleSubmit} className="form-stack">
        {/* Nombre y correo eliminados: el backend obtiene usuario/email desde el token */}

        <label>
          Motivo
          <textarea name="reason" value={form.reason} onChange={handleChange} rows="4" required />
        </label>

        <div className="form-actions">
          <button type="submit" className="add-btn" disabled={sending}>
            {sending ? 'Enviando...' : 'Solicitar baja'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Unsubscribe;
