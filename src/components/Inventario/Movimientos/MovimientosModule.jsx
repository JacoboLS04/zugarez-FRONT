import React, { useState } from "react";
import "./MovimientosModule.css";
import MovimientoForm from "./MovimientoForm";

const MovimientosModule = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
          {movimientos.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.lote}</td>
              <td>{m.tipo}</td>
              <td>{m.cantidad}</td>
              <td>{m.fecha}</td>
              <td>{m.motivo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <MovimientoForm
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMovimiento}
        />
      )}
    </div>
  );
};

export default MovimientosModule;
