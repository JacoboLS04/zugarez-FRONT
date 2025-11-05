import { useState } from 'react';
import api from '../../../services/api';

const ReportesPage = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reporte, setReporte] = useState(null);

  const generarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Seleccione el rango de fechas');
      return;
    }
    try {
      const response = await api.get('/reportes/nomina/periodo', { params: { inicio: fechaInicio, fin: fechaFin } });
      setReporte(response.data);
    } catch (error) {
      alert('Error al generar reporte: ' + (error.response?.data?.message || ''));
    }
  };

  return (
    <div className="reportes-page">
      <h1>Reportes de Nómina</h1>
      <div className="filtros">
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} placeholder="Fecha Inicio" />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} placeholder="Fecha Fin" />
        <button className="btn-primary" onClick={generarReporte}>Generar Reporte</button>
      </div>

      {reporte && (
        <div className="reporte-resultado">
          <h2>Reporte del Período</h2>
          <p>{reporte.periodoInicio} al {reporte.periodoFin}</p>

          <div className="estadisticas-grid">
            <div className="stat-card">
              <h3>Total Empleados</h3>
              <p className="stat-number">{reporte.totalEmpleados}</p>
            </div>
            <div className="stat-card">
              <h3>Total Salarios</h3>
              <p className="stat-number">S/. {reporte.totalSalarios}</p>
            </div>
            <div className="stat-card">
              <h3>Total Deducciones</h3>
              <p className="stat-number">S/. {reporte.totalDeducciones}</p>
            </div>
            <div className="stat-card">
              <h3>Horas Extras</h3>
              <p className="stat-number">{reporte.totalHorasExtras} hrs</p>
            </div>
          </div>

          <div className="estadisticas-estado">
            <h3>Distribución por Estado</h3>
            <ul>
              {Object.entries(reporte.estadisticasPorEstado).map(([estado, cantidad]) => (
                <li key={estado}><strong>{estado}:</strong> {cantidad} nóminas</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportesPage;
