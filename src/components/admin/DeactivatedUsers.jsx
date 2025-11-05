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
      console.log('DeactivatedUsers: loading list from /api/admin/users/deactivated');
      const response = await api.get('/api/admin/users/deactivated');
      console.log('DeactivatedUsers: response', response?.data);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      if (error.response) {
        console.error('Backend response data:', error.response.data);
        console.error('Backend status:', error.response.status);
        const errorMsg = error.response.data?.error || error.response.data?.message || 'Error desconocido';
        window.alert(`Error al cargar usuarios desactivados (status ${error.response.status}): ${errorMsg}`);
      } else if (error.request) {
        console.error('No response from server:', error.request);
        window.alert('Error: No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        console.error('Error:', error.message);
        window.alert(`Error al cargar usuarios desactivados: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  async function reactivateUser(userId, username) {
    if (!window.confirm(`¿Estás seguro de reactivar al usuario "${username}"?`)) return;
    setProcessing(userId);
    try {
      console.log(`Reactivating user ${userId} via /api/admin/users/${userId}/reactivate`);
      await api.post(`/api/admin/users/${userId}/reactivate`);
      window.alert(`Usuario "${username}" reactivado correctamente`);
      await loadDeactivatedUsers();
    } catch (error) {
      console.error('Error al reactivar:', error);
      if (error.response) {
        const errorMsg = error.response.data?.error || error.response.data?.message || 'Error desconocido';
        window.alert(`Error al reactivar usuario: ${errorMsg}`);
      } else {
        window.alert('Error al reactivar usuario. Verifica tu conexión.');
      }
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
                <td style={{padding:8}}>{user.deactivationReason || 'Sin motivo especificado'}</td>
                <td style={{padding:8}}>
                  <button 
                    onClick={() => reactivateUser(user.id, user.username)}
                    className="btn-reactivate"
                    disabled={processing === user.id}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: processing === user.id ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: processing === user.id ? 'not-allowed' : 'pointer'
                    }}
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
