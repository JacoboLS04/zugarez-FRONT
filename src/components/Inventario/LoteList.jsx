import React, { useState } from "react";
import "./LoteList.css";


const LoteList = () => {
  const [lotes, setLotes] = useState([
    {
      id_lote: 1,
      producto: "Coca-Cola",
      fecha_vencimiento: "2026-03-12",
      cantidad_inicial: 100,
      cantidad_disponible: 100,
      precio_lote: 50000,
      precio_unidad: 500,
    },
    {
      id_lote: 2,
      producto: "Empanada",
      fecha_vencimiento: "2025-10-01",
      cantidad_inicial: 50,
      cantidad_disponible: 50,
      precio_lote: 20000,
      precio_unidad: 400,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleAddLote = (nuevoLote) => {
    setLotes([...lotes, { ...nuevoLote, id_lote: lotes.length + 1 }]);
    setShowForm(false);
  };

  return (
    <div className="lote-module">
      <div className="lote-header">
        <h2>Gestión de Lotes</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          ➕ Añadir Lote
        </button>
      </div>

      
      <table className="lote-table">
        <thead>
          <tr>
            <th># Loteeee</th>
            <th>Producto</th>
            <th>Fecha vencimiento</th>
            <th>Cant. Inicial</th>
            <th>Cant. Disponible</th>
            <th>Precio Lote</th>
            <th>Precio Unidad</th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((lote) => (
            <tr key={lote.id_lote}>
              <td>{lote.producto}</td>
              <td>{lote.fecha_vencimiento}</td>
              <td>{lote.cantidad_inicial}</td>
              <td>{lote.cantidad_disponible}</td>
              <td>${lote.precio_lote}</td>
              <td>${lote.precio_unidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoteList;
