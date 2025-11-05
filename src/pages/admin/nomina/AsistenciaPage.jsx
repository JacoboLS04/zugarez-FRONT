import { useState, useEffect } from 'react';
import api from '../../../services/api';

const AsistenciaPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [turno, setTurno] = useState('MANANA');

  useEffect(() => {
    cargarEmpleados();
    cargarRegistrosHoy();
  }, []);

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
      const response = await api.get(`/api/asistencia/empleado/1?inicio=${hoy}&fin=${hoy}`);
      setRegistros(response.data);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    }
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
              <th>Empleado</th>
              <th>Turno</th>
              <th>Hora Entrada</th>
              <th>Hora Salida</th>
              <th>Horas Trabajadas</th>
              <th>Horas Extras</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map(reg => (
              <tr key={reg.id}>
                <td>{reg.empleadoNombre}</td>
                <td>{reg.turno}</td>
                <td>{new Date(reg.horaEntrada).toLocaleTimeString()}</td>
                <td>{reg.horaSalida ? new Date(reg.horaSalida).toLocaleTimeString() : '-'}</td>
                <td>{reg.horasTrabajadas || '-'}</td>
                <td>{reg.horasExtras || '-'}</td>
                <td>
                  {!reg.horaSalida && (
                    <button className="btn-sm btn-primary" onClick={() => registrarSalida(reg.id)}>
                      Registrar Salida
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsistenciaPage;
