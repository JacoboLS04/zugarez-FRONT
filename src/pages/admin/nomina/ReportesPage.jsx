import { useState } from 'react';
import api from '../../../services/api';

const ReportesPage = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [empleadoId, setEmpleadoId] = useState(''); // nuevo filtro opcional
  const [reporte, setReporte] = useState(null);

  const generarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      window.alert('Seleccione el rango de fechas');
      return;
    }
    try {
      const params = { inicio: fechaInicio, fin: fechaFin };
      if (empleadoId) params.empleadoId = empleadoId;
      const response = await api.get('/api/reportes/nomina/periodo', { params });

      const { resumen = {}, items = [] } = response.data || {};
      setReporte({ resumen, items });
    } catch (error) {
      window.alert('Error al generar reporte: ' + (error.response?.data?.message || ''));
      setReporte(null);
    }
  };

  return (
    <div className="reportes-page">
      <h1>Reportes de Nómina</h1>
      <div className="filtros" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          placeholder="Fecha Inicio"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          placeholder="Fecha Fin"
        />
        <input
          type="number"
          min="1"
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
          placeholder="Empleado ID (opcional)"
          style={{ minWidth:160 }}
        />
        <button className="btn-primary" onClick={generarReporte}>Generar Reporte</button>
      </div>

      {reporte && (
        <div className="reporte-resultado" style={{ marginTop:24 }}>
          <h2>Reporte del Período</h2>
          <p>{reporte.resumen.periodoInicio} al {reporte.resumen.periodoFin}</p>

            <div className="estadisticas-grid" style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', marginTop:12 }}>
              <div className="stat-card">
                <h3>Total Empleados</h3>
                <p className="stat-number">{reporte.resumen.totalEmpleados}</p>
              </div>
              <div className="stat-card">
                <h3>Total Salarios</h3>
                <p className="stat-number">S/. {reporte.resumen.totalSalarios}</p>
              </div>
              <div className="stat-card">
                <h3>Total Deducciones</h3>
                <p className="stat-number">S/. {reporte.resumen.totalDeducciones}</p>
              </div>
              <div className="stat-card">
                <h3>Horas Extras</h3>
                <p className="stat-number">{reporte.resumen.totalHorasExtras} hrs</p>
              </div>
            </div>

            <div className="estadisticas-estado" style={{ marginTop:24 }}>
              <h3>Distribución por Estado</h3>
              <ul>
                {Object.entries(reporte.resumen.estadisticasPorEstado || {}).map(([estado, cantidad]) => (
                  <li key={estado}>
                    <strong>{estado}:</strong> {cantidad} nóminas
                  </li>
                ))}
                {Object.keys(reporte.resumen.estadisticasPorEstado || {}).length === 0 && (
                  <li>Sin datos de distribución</li>
                )}
              </ul>
            </div>

            <div style={{ marginTop:32 }}>
              <h3>Detalle de Nóminas</h3>
              {reporte.items.length > 0 ? (
                <div style={{ overflowX:'auto' }}>
                  <table className="data-table" style={{ minWidth:700 }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Empleado</th>
                        <th>Período</th>
                        <th>Estado</th>
                        <th>Salario Neto</th>
                        <th>Horas Extras</th>
                        <th>Total Deducciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporte.items.map(row => (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td>{row.empleadoNombre}</td>
                          <td>{row.periodoInicio} / {row.periodoFin}</td>
                          <td>
                            <span className={`badge badge-${(row.estado || 'SIN').toLowerCase()}`}>
                              {row.estado || 'SIN'}
                            </span>
                          </td>
                          <td>S/. {row.salarioNeto}</td>
                          <td>{row.horasExtras}</td>
                          <td>S/. {row.totalDeducciones}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ marginTop:8 }}>No hay ítems para el criterio seleccionado.</p>
              )}
            </div>
        </div>
      )}
    </div>
  );
};

export default ReportesPage;
