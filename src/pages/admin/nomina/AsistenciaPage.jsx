import { useState, useEffect } from 'react';
import api from '../../../services/api';

const AsistenciaPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [turno, setTurno] = useState('MANANA');

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (empleados.length) {
      cargarRegistrosHoy();
    }
  }, [empleados]);

  const cargarEmpleados = async () => {
    try {
      const response = await api.get('/api/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const cargarRegistrosHoy = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    try {
      // Solicita registros de todos los empleados para hoy
      const all = await Promise.all(
        empleados.map(emp =>
          api
            .get(`/api/asistencia/empleado/${emp.id}?inicio=${hoy}&fin=${hoy}`)
            .then(r => r.data)
            .catch(() => [])
        )
      );
      // Aplanar y ordenar por horaEntrada
      const planos = all.flat().sort(
        (a, b) => new Date(a.horaEntrada) - new Date(b.horaEntrada)
      );
      setRegistros(planos);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    }
  };

  // Helper para formatear hora segura
  const fmtHora = (value) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleTimeString();
    } catch {
      return '-';
    }
  };

  // Cálculo local si backend no envía horasTrabajadas / horasExtras
  const calcularHoras = (entrada, salida) => {
    if (!entrada || !salida) return null;
    const ms = new Date(salida) - new Date(entrada);
    if (ms <= 0) return null;
    const horas = ms / 1000 / 3600;
    return horas.toFixed(2);
  };

  const calcularExtras = (horasTrabajadas, turno) => {
    if (!horasTrabajadas) return null;
    const baseTurno = {
      MANANA: 8,
      TARDE: 8,
      NOCHE: 8,
      COMPLETO: 8
    }[turno] || 8;
    const extras = parseFloat(horasTrabajadas) - baseTurno;
    return extras > 0 ? extras.toFixed(2) : '0.00';
  };

  const registrarEntrada = async () => {
    if (!selectedEmpleado) {
      alert('Selecciona un empleado');
      return;
    }
    try {
      await api.post('/api/asistencia/entrada', {
        empleadoId: parseInt(selectedEmpleado),
        turno: turno
      });
      window.alert('Entrada registrada exitosamente');
      cargarRegistrosHoy();
    } catch (error) {
      window.alert('Error al registrar entrada: ' + (error.response?.data?.message || ''));
    }
  };

  const registrarSalida = async (registroId) => {
    try {
      await api.put(`/api/asistencia/${registroId}/salida`);
      window.alert('Salida registrada exitosamente');
      cargarRegistrosHoy();
    } catch (error) {
      window.alert('Error al registrar salida: ' + (error.response?.data?.message || ''));
    }
  };

  return (
    <div className="asistencia-page">
      <h1>Registro de Asistencia</h1>
      <div className="registro-form">
        <h2>Registrar Entrada</h2>
        <div className="form-row">
          <select value={selectedEmpleado} onChange={(e) => setSelectedEmpleado(e.target.value)} className="form-control">
            <option value="">Seleccionar empleado...</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombres} {emp.apellidos}</option>
            ))}
          </select>
          <select value={turno} onChange={(e) => setTurno(e.target.value)} className="form-control">
            <option value="MANANA">Mañana</option>
            <option value="TARDE">Tarde</option>
            <option value="NOCHE">Noche</option>
            <option value="COMPLETO">Completo</option>
          </select>
          <button className="btn-primary" onClick={registrarEntrada}>Registrar Entrada</button>
        </div>
      </div>

      <div className="registros-hoy">
        <h2>Asistencias de Hoy</h2>
        <table className="data-table">
          <thead>
            <tr>
              {/* nuevas columnas */}
              <th>Fecha</th>
              <th>Empleado</th>
              <th>Turno</th>
              <th>Hora Entrada</th>
              <th>Hora Salida</th>
              <th>Horas Trabajadas</th>
              <th>Horas Extras</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map(reg => {
              const horasCalc = reg.horasTrabajadas || calcularHoras(reg.horaEntrada, reg.horaSalida);
              const extrasCalc = reg.horasExtras || calcularExtras(horasCalc, reg.turno);
              const fecha = reg.horaEntrada ? new Date(reg.horaEntrada).toLocaleDateString() : '-';
              const estado = reg.horaSalida ? 'CERRADA' : 'EN CURSO';
              return (
                <tr key={reg.id}>
                  <td>{fecha}</td>
                  <td>{reg.empleadoNombre}</td>
                  <td>{reg.turno}</td>
                  <td>{fmtHora(reg.horaEntrada)}</td>
                  <td>{fmtHora(reg.horaSalida)}</td>
                  <td>{horasCalc || '-'}</td>
                  <td>{extrasCalc || '-'}</td>
                  <td>{estado}</td>
                  <td>
                    {!reg.horaSalida && (
                      <button
                        className="btn-sm btn-primary"
                        onClick={() => registrarSalida(reg.id)}
                      >
                        Registrar Salida
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!registros.length && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center' }}>
                  Sin registros hoy
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsistenciaPage;
