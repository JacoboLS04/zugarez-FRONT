import { useState, useEffect } from 'react';
import api from '../../../services/api';

const CalcularNominaPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    empleadoId: '',
    periodoInicio: '',
    periodoFin: '',
    comisiones: '0',
    bonificaciones: '0'
  });
  const [resultado, setResultado] = useState(null);

  useEffect(() => { cargarEmpleados(); }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await api.get('/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const handleCalcular = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/nomina/calcular', {
        empleadoId: parseInt(formData.empleadoId),
        periodoInicio: formData.periodoInicio,
        periodoFin: formData.periodoFin,
        comisiones: parseFloat(formData.comisiones),
        bonificaciones: parseFloat(formData.bonificaciones)
      });
      setResultado(response.data);
      alert('Nómina calculada exitosamente');
    } catch (error) {
      alert('Error al calcular nómina: ' + (error.response?.data?.message || ''));
    }
  };

  return (
    <div className="calcular-nomina-page">
      <h1>Calcular Nómina</h1>

      <form onSubmit={handleCalcular} className="nomina-form">
        <div className="form-group">
          <label>Empleado *</label>
          <select value={formData.empleadoId} onChange={(e) => setFormData({...formData, empleadoId: e.target.value})} required>
            <option value="">Seleccionar empleado...</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombres} {emp.apellidos}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Período Inicio *</label>
            <input type="date" value={formData.periodoInicio} onChange={(e) => setFormData({...formData, periodoInicio: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Período Fin *</label>
            <input type="date" value={formData.periodoFin} onChange={(e) => setFormData({...formData, periodoFin: e.target.value})} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Comisiones</label>
            <input type="number" step="0.01" value={formData.comisiones} onChange={(e) => setFormData({...formData, comisiones: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Bonificaciones</label>
            <input type="number" step="0.01" value={formData.bonificaciones} onChange={(e) => setFormData({...formData, bonificaciones: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="btn-primary btn-large">Calcular Nómina</button>
      </form>

      {resultado && (
        <div className="resultado-calculo">
          <h2>Resultado del Cálculo</h2>
          <div className="resultado-grid">
            <div className="resultado-card">
              <h3>Ingresos</h3>
              <p>Salario Base: S/. {resultado.salarioBase}</p>
              <p>Horas Trabajadas: {resultado.horasTrabajadas}</p>
              <p>Horas Extras: {resultado.horasExtras}</p>
              <p>Pago Horas Extras: S/. {resultado.pagoHorasExtras}</p>
              <p>Comisiones: S/. {resultado.comisiones}</p>
              <p>Bonificaciones: S/. {resultado.bonificaciones}</p>
              <hr />
              <p><strong>Total Ingresos: S/. {resultado.totalIngresos}</strong></p>
            </div>

            <div className="resultado-card">
              <h3>Deducciones</h3>
              <p>EsSalud (9%): S/. {resultado.deduccionEssalud || '0.00'}</p>
              <p>ONP (13%): S/. {resultado.deduccionOnp || '0.00'}</p>
              <hr />
              <p><strong>Total Deducciones: S/. {resultado.totalDeducciones}</strong></p>
            </div>

            <div className="resultado-card neto">
              <h3>Neto a Pagar</h3>
              <p className="monto-neto">S/. {resultado.salarioNeto}</p>
              <p>Estado: <span className="badge badge-success">{resultado.estado}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalcularNominaPage;
