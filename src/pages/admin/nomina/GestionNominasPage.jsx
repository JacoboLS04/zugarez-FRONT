import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

const GestionNominasPage = () => {
  const [nominas, setNominas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroEmpleadoId, setFiltroEmpleadoId] = useState(''); // nuevo filtro por empleado
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutData, setPayoutData] = useState(null);

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

  const changeEstado = async (id, nuevoEstado) => {
    let body = { estado: nuevoEstado };

    if (nuevoEstado === 'PAGADA') {
      const numeroTransaccion = window.prompt('Ingrese el número de transacción:');
      if (!numeroTransaccion) return;
      body.numeroTransaccion = numeroTransaccion;
    }

    if (nuevoEstado === 'CANCELADA' && !window.confirm('¿Confirmar cancelación de la nómina?')) return;
    if (nuevoEstado === 'CALCULADA' && !window.confirm('¿Revertir la nómina a CALCULADA?')) return;

    try {
      const response = await api.put(`/api/nomina/${id}/estado`, body);
      window.alert('Estado actualizado');
      // Mostrar modal de pago si aplica
      const payout = response?.data?.payout;
      if (nuevoEstado === 'PAGADA' && payout?.success) {
        setPayoutData({
          titulo: 'Pago enviado',
          mensaje: payout.mensaje,
          banco: payout.banco,
          cuenta: payout.cuenta,
          monto: payout.monto,
          numeroTransaccion: payout.numeroTransaccion
        });
        setPayoutModalOpen(true);
      }
      cargarNominas();
    } catch (error) {
      window.alert('Error al cambiar estado: ' + (error.response?.data?.message || ''));
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
      {/* Modal payout */}
      {payoutModalOpen && payoutData && (
        <div
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000
          }}
          onClick={() => { setPayoutModalOpen(false); setPayoutData(null); }}
        >
          <div
            onClick={(e)=>e.stopPropagation()}
            style={{
              background:'#fff', padding:20, borderRadius:12, width:'100%', maxWidth:420,
              boxShadow:'0 8px 28px rgba(0,0,0,0.2)', color:'#2C3E50', display:'grid', gap:10
            }}
          >
            <h3 style={{margin:'0 0 4px'}}>✅ {payoutData.titulo}</h3>
            <p style={{margin:0}}>{payoutData.mensaje}</p>
            <div style={{fontSize:14, lineHeight:1.4}}>
              <p><strong>Banco:</strong> {payoutData.banco}</p>
              <p><strong>Cuenta:</strong> {payoutData.cuenta}</p>
              <p><strong>Monto:</strong> S/. {payoutData.monto}</p>
              <p><strong>Transacción:</strong> {payoutData.numeroTransaccion}</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => { setPayoutModalOpen(false); setPayoutData(null); }}
              style={{justifySelf:'end'}}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

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
            <th>Cambiar Estado</th>
            <th>Fecha Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {nominas.map(nomina => {
            const estado = nomina?.estado || 'SIN ESTADO';
            const estadoLower = typeof estado === 'string' ? estado.toLowerCase() : 'default';
            return (
              <tr key={nomina.id}>
                <td>{nomina.id}</td>
                <td>{nomina.empleadoNombre}</td>
                <td>{nomina.periodoInicio} / {nomina.periodoFin}</td>
                <td>S/. {nomina.salarioNeto}</td>
                <td><span className={`badge badge-${estadoLower}`}>{estado}</span></td>
                <td>
                  <select
                    className="form-control form-control-sm"
                    value={estado}
                    onChange={(e) => changeEstado(nomina.id, e.target.value)}
                  >
                    <option value="CALCULADA">CALCULADA</option>
                    <option value="APROBADA">APROBADA</option>
                    <option value="PAGADA">PAGADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </select>
                </td>
                <td>{nomina.fechaPago || '-'}</td>
                <td>
                  {estado === 'PAGADA' && (
                    <button
                      className="btn-sm btn-info"
                      onClick={() => descargarComprobante(nomina.id)}
                    >
                      📄 Comprobante
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GestionNominasPage;
