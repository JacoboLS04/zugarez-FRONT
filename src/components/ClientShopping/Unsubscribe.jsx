import React, { useState } from 'react';

const Unsubscribe = () => {
  const [form, setForm] = useState({ name: '', email: '', reason: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.reason.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (!window.confirm('¿Confirmas que deseas solicitar la baja?')) return;

    setSending(true);
    try {
      // placeholder: sustituir por tu endpoint real
      await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      alert('Solicitud enviada. Revisaremos tu petición.');
      setForm({ name: '', email: '', reason: '' });
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
        <label>
          Nombre
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Correo
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

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
