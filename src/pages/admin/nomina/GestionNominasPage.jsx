import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

const GestionNominasPage = () => {
  const [nominas, setNominas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroEmpleadoId, setFiltroEmpleadoId] = useState(''); // nuevo filtro por empleado

  const cargarNominas = useCallback(async () => {
    try {
      const url = filtroEstado
        ? `/api/nomina/estado/${filtroEstado}`
        : `/api/nomina/empleado/${filtroEmpleadoId || 1}`; // usa empleado si no hay estado (default 1)
      const response = await api.get(url);
      setNominas(response.data);
    } catch (error) {
      console.error('Error al cargar nóminas:', error);
    }
  }, [filtroEstado, filtroEmpleadoId]);

  useEffect(() => {
    cargarNominas();
  }, [cargarNominas]);

  const aprobarNomina = async (id) => {
    if (!window.confirm('¿Está seguro de aprobar esta nómina?')) return;
    try {
      await api.put(`/api/nomina/${id}/aprobar`);
      window.alert('Nómina aprobada exitosamente');
      cargarNominas();
    } catch (error) {
      window.alert('Error al aprobar nómina: ' + (error.response?.data?.message || ''));
    }
  };

  const registrarPago = async (id) => {
    const numeroTransaccion = window.prompt('Ingrese el número de transacción:');
    if (!numeroTransaccion) return;
    try {
      await api.put(`/api/nomina/${id}/registrar-pago`, { numeroTransaccion });
      window.alert('Pago registrado exitosamente');
      cargarNominas();
    } catch (error) {
      window.alert('Error al registrar pago: ' + (error.response?.data?.message || ''));
    }
  };

  const descargarComprobante = async (id) => {
    try {
      const response = await api.get(`/api/comprobantes/nomina/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprobante_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      window.alert('Error al descargar comprobante');
    }
  };

  return (
    <div className="gestion-nominas-page">
      <div className="page-header">
        <h1>Gestión de Nóminas</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="form-control">
            <option value="">Todos los estados</option>
            <option value="CALCULADA">Calculada</option>
            <option value="APROBADA">Aprobada</option>
            <option value="PAGADA">Pagada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <input
            type="number"
            min="1"
            className="form-control"
            placeholder="Empleado ID"
            value={filtroEmpleadoId}
            onChange={(e) => setFiltroEmpleadoId(e.target.value)}
            title="Filtrar por ID de empleado"
          />
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Empleado</th>
            <th>Período</th>
            <th>Salario Neto</th>
            <th>Estado</th>
            <th>Fecha Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {nominas.map(nomina => (
            <tr key={nomina.id}>
              <td>{nomina.id}</td>
              <td>{nomina.empleadoNombre}</td>
              <td>{nomina.periodoInicio} / {nomina.periodoFin}</td>
              <td>S/. {nomina.salarioNeto}</td>
              <td>
                <span className={`badge badge-${nomina.estado.toLowerCase()}`}>{nomina.estado}</span>
              </td>
              <td>{nomina.fechaPago || '-'}</td>
              <td>
                {nomina.estado === 'CALCULADA' && (
                  <button className="btn-sm btn-success" onClick={() => aprobarNomina(nomina.id)}>Aprobar</button>
                )}
                {nomina.estado === 'APROBADA' && (
                  <button className="btn-sm btn-primary" onClick={() => registrarPago(nomina.id)}>Registrar Pago</button>
                )}
                {nomina.estado === 'PAGADA' && (
                  <button className="btn-sm btn-info" onClick={() => descargarComprobante(nomina.id)}>📄 Comprobante</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionNominasPage;
