import React, { useState, useEffect } from "react";
import "./MovimientosModule.css";
import MovimientoForm from "./MovmientoForm";
import { useAuthenticatedRequest } from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const MovimientosModule = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { makeRequest } = useAuthenticatedRequest();
  const LOTES_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app/inventory/lotes';

  useEffect(() => {
    loadLotes();
  }, []);

  const loadLotes = async () => {
    try {
      setLoading(true);
      const data = await makeRequest(LOTES_URL, { method: 'GET' });
      setLotes(data || []);
    } catch (error) {
      console.error('Error cargando lotes:', error);
      Swal.fire('Error', 'No se pudieron cargar los lotes: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovimiento = (nuevo) => {
    setMovimientos([...movimientos, { ...nuevo, id: movimientos.length + 1 }]);
    setShowModal(false); // cerrar modal al guardar
  };

  return (
    <div className="movimientos-module">
      <h2>Movimientos de Inventario</h2>
      <button className="btn-add" onClick={() => setShowModal(true)}>
        ➕ Registrar Movimiento
      </button>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Lote</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.length > 0 ? (
            movimientos.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.lote}</td>
                <td>{m.tipo}</td>
                <td>{m.cantidad}</td>
                <td>{m.fecha}</td>
                <td>{m.motivo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                No hay movimientos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <MovimientoForm
          lotes={lotes}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMovimiento}
          loading={loading}
        />
      )}
    </div>
  );
};

export default MovimientosModule;
