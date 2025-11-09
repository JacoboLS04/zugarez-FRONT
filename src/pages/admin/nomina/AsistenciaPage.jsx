import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

const AsistenciaPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [turno, setTurno] = useState('MANANA');
  const hoyISO = new Date().toISOString().split('T')[0];
  const [fechaInicio, setFechaInicio] = useState(hoyISO);
  const [fechaFin, setFechaFin] = useState(hoyISO);
  const [filtroEmpleadoId, setFiltroEmpleadoId] = useState('');

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await api.get('/api/empleados');
      setEmpleados(response.data || []);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  // Helper: nombre empleado desde 'empleados' o del propio registro
  const getEmpleadoNombre = useCallback(
    (reg) => {
      const empId =
        reg.empleadoId ??
        reg.empleadoID ??
        reg.empleado?.id ??
        reg.empleado?.empleadoId;
      const emp = empleados.find((e) => e.id === empId);
      if (emp) return `${emp.nombres} ${emp.apellidos}`.trim();
      return reg.empleadoNombre || reg.empleado?.nombreCompleto || '-';
    },
    [empleados]
  );

  const cargarRegistros = useCallback(async () => {
    try {
      // Determina sobre qué empleados consultar
      const ids = filtroEmpleadoId
        ? [parseInt(filtroEmpleadoId, 10)]
        : empleados.map((e) => e.id);

      if (!ids.length) {
        setRegistros([]);
        return;
      }

      const all = await Promise.all(
        ids.map((id) =>
          api
            .get(`/api/asistencia/empleado/${id}?inicio=${fechaInicio}&fin=${fechaFin}`)
            .then((r) => r.data)
            .catch(() => [])
        )
      );

      const planos = all
        .flat()
        .map((r) => ({
          ...r,
          empleadoNombre: getEmpleadoNombre(r),
        }))
        .sort((a, b) => new Date(a.horaEntrada) - new Date(b.horaEntrada));

      setRegistros(planos);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    }
  }, [empleados, filtroEmpleadoId, fechaInicio, fechaFin, getEmpleadoNombre]);

  useEffect(() => {
    if (empleados.length) {
      cargarRegistros();
    }
  }, [cargarRegistros]);

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
    const baseTurno = { MANANA: 8, TARDE: 8, NOCHE: 8, COMPLETO: 8 }[turno] || 8;
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
        empleadoId: parseInt(selectedEmpleado, 10),
        turno: turno,
      });
      window.alert('Entrada registrada exitosamente');
      cargarRegistros();
    } catch (error) {
      window.alert('Error al registrar entrada: ' + (error.response?.data?.message || ''));
    }
  };

  const registrarSalida = async (registroId) => {
    try {
      await api.put(`/api/asistencia/${registroId}/salida`);
      window.alert('Salida registrada exitosamente');
      cargarRegistros();
    } catch (error) {
      window.alert('Error al registrar salida: ' + (error.response?.data?.message || ''));
    }
  };

  const empleadoSeleccionado = empleados.find((e) => String(e.id) === String(selectedEmpleado));
  const etiquetaEmpleado = empleadoSeleccionado
    ? `${empleadoSeleccionado.nombres} ${empleadoSeleccionado.apellidos}`.trim()
    : 'Ninguno';

  return (
    <div className="asistencia-page">
      <h1>Registro de Asistencia</h1>
      <div className="registro-form">
        <h2>Registrar Entrada</h2>
        <div className="form-row" style={{ display: 'grid', gap: 8 }}>
          <select
            value={selectedEmpleado}
            onChange={(e) => setSelectedEmpleado(e.target.value)}
            className="form-control"
          >
            <option value="">Seleccionar empleado...</option>
            {empleados.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombres} {emp.apellidos}
              </option>
            ))}
          </select>
          <small style={{ color: '#555' }}>Empleado seleccionado: {etiquetaEmpleado}</small>

          <select value={turno} onChange={(e) => setTurno(e.target.value)} className="form-control">
            <option value="MANANA">Mañana</option>
            <option value="TARDE">Tarde</option>
            <option value="NOCHE">Noche</option>
            <option value="COMPLETO">Completo</option>
          </select>

          <button className="btn-primary" onClick={registrarEntrada}>
            Registrar Entrada
          </button>
        </div>
      </div>

      <div className="registros-hoy" style={{ marginTop: 24 }}>
        <h2>Asistencias</h2>

        {/* Filtros para completar la tabla */}
        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, marginBottom: 12 }}>
          <select
            className="form-control"
            value={filtroEmpleadoId}
            onChange={(e) => setFiltroEmpleadoId(e.target.value)}
          >
            <option value="">Todos los empleados</option>
            {empleados.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombres} {emp.apellidos}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <button className="btn-primary" onClick={cargarRegistros}>
            Buscar
          </button>
        </div>

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
            {registros.map((reg) => {
              const horasCalc = reg.horasTrabajadas || calcularHoras(reg.horaEntrada, reg.horaSalida);
              const extrasCalc = reg.horasExtras || calcularExtras(horasCalc, reg.turno);
              const fecha = reg.horaEntrada ? new Date(reg.horaEntrada).toLocaleDateString() : '-';
              const estado = reg.horaSalida ? 'CERRADA' : 'EN CURSO';
              return (
                <tr key={reg.id}>
                  <td>{fecha}</td>
                  <td>{getEmpleadoNombre(reg)}</td>
                  <td>{reg.turno}</td>
                  <td>{fmtHora(reg.horaEntrada)}</td>
                  <td>{fmtHora(reg.horaSalida)}</td>
                  <td>{horasCalc || '-'}</td>
                  <td>{extrasCalc || '-'}</td>
                  <td>{estado}</td>
                  <td>
                    {!reg.horaSalida && (
                      <button className="btn-sm btn-primary" onClick={() => registrarSalida(reg.id)}>
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
                  Sin registros para el criterio seleccionado
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
