import { useState, useEffect } from 'react';
import api from '../../../services/api';

const CalcularNominaPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    empleadoId: '',
    periodoInicio: '',
    periodoFin: '',
    salarioBaseMensual: '',         // nuevo campo
    horasTrabajadas: '',            // opcional override
    horasExtras: '',                // opcional override
    comisiones: '0',
    bonificaciones: '0'
  });
  const [resultado, setResultado] = useState(null);
  const [mostrarAvanzados, setMostrarAvanzados] = useState(false);

  useEffect(() => { cargarEmpleados(); }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await api.get('/api/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const handleCalcular = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        inicio: formData.periodoInicio,
        fin: formData.periodoFin,
      };
      if (formData.empleadoId) payload.empleadoId = parseInt(formData.empleadoId, 10);
      if (formData.salarioBaseMensual) payload.salarioBaseMensual = parseFloat(formData.salarioBaseMensual);
      if (formData.horasTrabajadas) payload.horasTrabajadas = parseFloat(formData.horasTrabajadas);
      if (formData.horasExtras) payload.horasExtras = parseFloat(formData.horasExtras);
      if (formData.comisiones) payload.comisiones = parseFloat(formData.comisiones);
      if (formData.bonificaciones) payload.bonificaciones = parseFloat(formData.bonificaciones);

      const response = await api.post('/api/nomina/calcular', payload);
      setResultado(response.data);
      window.alert('Nómina calculada exitosamente');
    } catch (error) {
      window.alert('Error al calcular nómina: ' + (error.response?.data?.message || ''));
    }
  };

  return (
    <div className="calcular-nomina-page">
      <h1>Calcular Nómina</h1>
      <form onSubmit={handleCalcular} className="nomina-form">
        {/* Empleado */}
        <div className="form-group">
          <label>Empleado *</label>
          <select
            value={formData.empleadoId}
            onChange={(e) => setFormData({ ...formData, empleadoId: e.target.value })}
            required
          >
            <option value="">Seleccionar empleado...</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombres} {emp.apellidos}</option>
            ))}
          </select>
        </div>

        {/* Fechas */}
        <div className="form-row">
          <div className="form-group">
            <label>Período Inicio *</label>
            <input
              type="date"
              value={formData.periodoInicio}
              onChange={(e) => setFormData({ ...formData, periodoInicio: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Período Fin *</label>
            <input
              type="date"
              value={formData.periodoFin}
              onChange={(e) => setFormData({ ...formData, periodoFin: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Salario base mensual */}
        <div className="form-group">
          <label>Salario Base Mensual (opcional si no viene del empleado)</label>
            <input
              type="number"
              step="0.01"
              value={formData.salarioBaseMensual}
              onChange={(e) => setFormData({ ...formData, salarioBaseMensual: e.target.value })}
              placeholder="Ej: 1500.00"
            />
        </div>

        {/* Comisiones / Bonificaciones */}
        <div className="form-row">
          <div className="form-group">
            <label>Comisiones</label>
            <input
              type="number"
              step="0.01"
              value={formData.comisiones}
              onChange={(e) => setFormData({ ...formData, comisiones: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Bonificaciones</label>
            <input
              type="number"
              step="0.01"
              value={formData.bonificaciones}
              onChange={(e) => setFormData({ ...formData, bonificaciones: e.target.value })}
            />
          </div>
        </div>

        {/* Toggle campos avanzados */}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setMostrarAvanzados(v => !v)}
          style={{ marginBottom: 12 }}
        >
          {mostrarAvanzados ? 'Ocultar Campos Avanzados' : 'Mostrar Campos Avanzados'}
        </button>

        {mostrarAvanzados && (
          <div className="form-row">
            <div className="form-group">
              <label>Horas Trabajadas (override opcional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.horasTrabajadas}
                onChange={(e) => setFormData({ ...formData, horasTrabajadas: e.target.value })}
                placeholder="Ej: 160"
              />
            </div>
            <div className="form-group">
              <label>Horas Extras (override opcional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.horasExtras}
                onChange={(e) => setFormData({ ...formData, horasExtras: e.target.value })}
                placeholder="Ej: 10"
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary btn-large">Calcular Nómina</button>
      </form>

      {resultado && (
        <div className="resultado-calculo">
          <h2>Resultado del Cálculo</h2>
          <div className="resultado-grid">
            <div className="resultado-card">
              <h3>Ingresos</h3>
              <p>Salario Base Mensual: S/. {resultado.salarioBaseMensual}</p>
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
              <p>EsSalud: S/. {resultado.essalud || '0.00'}</p>
              <p>ONP: S/. {resultado.onp || '0.00'}</p>
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
