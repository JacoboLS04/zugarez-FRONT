import React, { useState } from "react";

import "./MovimientoForm.css"

const MovimientoForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    lote: "",
    tipo: "",
    cantidad: "",
    fecha: new Date().toISOString().split("T")[0],
    motivo: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // cerrar después de guardar
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Registrar Movimiento</h3>
        <form onSubmit={handleSubmit} className="form-movimiento">
          <label>Lote</label>
          <input
            placeholder="Traer de la BD"
            type="text"
            name="lote"
            value={formData.lote}
            onChange={handleChange}
            required
          />

          <label>Tipo de Movimiento</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione tipo</option>
            <option value="Entrada">Traer tipo de la BD</option>
          </select>

          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
          />

          <label>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />

          <label>Motivo</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovimientoForm;
