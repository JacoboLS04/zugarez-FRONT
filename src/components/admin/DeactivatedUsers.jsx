import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function DeactivatedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadDeactivatedUsers();
  }, []);

  async function loadDeactivatedUsers() {
    setLoading(true);
    try {
      const response = await api.get('/admin/users/deactivated');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios desactivados');
    } finally {
      setLoading(false);
    }
  }

  async function reactivateUser(userId, username) {
    if (!window.confirm(`¿Estás seguro de reactivar al usuario "${username}"?`)) return;
    setProcessing(userId);
    try {
      await api.post(`/admin/users/${userId}/reactivate`);
      alert(`Usuario "${username}" reactivado correctamente`);
      await loadDeactivatedUsers();
    } catch (error) {
      console.error('Error al reactivar:', error);
      alert('Error al reactivar usuario');
    } finally {
      setProcessing(null);
    }
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="deactivated-users-panel" style={{padding:16}}>
      <h2>Usuarios Desactivados ({users.length})</h2>

      {users.length === 0 ? (
        <p>No hay usuarios desactivados</p>
      ) : (
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{textAlign:'left',borderBottom:'1px solid #e5e7eb'}}>
              <th style={{padding:8}}>ID</th>
              <th style={{padding:8}}>Usuario</th>
              <th style={{padding:8}}>Email</th>
              <th style={{padding:8}}>Fecha de Baja</th>
              <th style={{padding:8}}>Motivo</th>
              <th style={{padding:8}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                <td style={{padding:8}}>{user.id}</td>
                <td style={{padding:8}}>{user.username}</td>
                <td style={{padding:8}}>{user.email}</td>
                <td style={{padding:8}}>{user.deactivatedAt ? new Date(user.deactivatedAt).toLocaleString() : ''}</td>
                <td style={{padding:8}}>{user.deactivationReason}</td>
                <td style={{padding:8}}>
                  <button 
                    onClick={() => reactivateUser(user.id, user.username)}
                    className="btn-reactivate"
                    disabled={processing === user.id}
                  >
                    {processing === user.id ? 'Procesando...' : '✅ Reactivar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
