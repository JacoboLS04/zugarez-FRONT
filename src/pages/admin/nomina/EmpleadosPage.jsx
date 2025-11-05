import { useState, useEffect } from 'react';
import api from '../../../services/api';

const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    fechaContratacion: '',
    salarioBase: '',
    tipoContrato: 'TIEMPO_COMPLETO',
    cuentaBancaria: '',
    banco: '',
    puestoId: ''
  });

  useEffect(() => { cargarEmpleados(); }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await api.get('/api/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/empleados', formData);
      window.alert('Empleado creado exitosamente');
      setShowModal(false);
      cargarEmpleados();
      resetForm();
    } catch (error) {
      window.alert('Error al crear empleado: ' + (error.response?.data?.message || ''));
    }
  };

  const resetForm = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      dni: '',
      email: '',
      telefono: '',
      fechaContratacion: '',
      salarioBase: '',
      tipoContrato: 'TIEMPO_COMPLETO',
      cuentaBancaria: '',
      banco: '',
      puestoId: ''
    });
  };

  return (
    <div className="empleados-page">
      <div className="page-header">
        <h1>Gestión de Empleados</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Empleado</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Puesto</th>
            <th>Salario Base</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(emp => (
            <tr key={emp.id}>
              <td>{emp.nombres} {emp.apellidos}</td>
              <td>{emp.dni}</td>
              <td>{emp.email}</td>
              <td>{emp.puestoNombre || 'N/A'}</td>
              <td>S/. {emp.salarioBase}</td>
              <td>
                <span className={`badge ${emp.activo ? 'badge-success' : 'badge-danger'}`}>
                  {emp.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <button className="btn-sm btn-secondary">Editar</button>
                <button className="btn-sm btn-danger">Desactivar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo Empleado</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input type="text" placeholder="Nombres*" value={formData.nombres} onChange={(e) => setFormData({...formData, nombres: e.target.value})} required />
                <input type="text" placeholder="Apellidos*" value={formData.apellidos} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} required />
                <input type="text" placeholder="DNI (8 dígitos)*" maxLength="8" value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value})} required />
                <input type="email" placeholder="Email*" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="text" placeholder="Teléfono" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
                <input type="date" placeholder="Fecha de Contratación*" value={formData.fechaContratacion} onChange={(e) => setFormData({...formData, fechaContratacion: e.target.value})} required />
                <input type="number" step="0.01" placeholder="Salario Base*" value={formData.salarioBase} onChange={(e) => setFormData({...formData, salarioBase: e.target.value})} required />
                <select value={formData.tipoContrato} onChange={(e) => setFormData({...formData, tipoContrato: e.target.value})}>
                  <option value="TIEMPO_COMPLETO">Tiempo Completo</option>
                  <option value="MEDIO_TIEMPO">Medio Tiempo</option>
                  <option value="POR_HORAS">Por Horas</option>
                  <option value="TEMPORAL">Temporal</option>
                  <option value="PRACTICAS">Prácticas</option>
                </select>
                <input type="text" placeholder="Cuenta Bancaria" value={formData.cuentaBancaria} onChange={(e) => setFormData({...formData, cuentaBancaria: e.target.value})} />
                <input type="text" placeholder="Banco" value={formData.banco} onChange={(e) => setFormData({...formData, banco: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpleadosPage;
