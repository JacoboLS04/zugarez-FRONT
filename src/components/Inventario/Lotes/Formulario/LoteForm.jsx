import React from "react";
import "./LoteForm.css";

const LoteForm = ({ formData, onChange, onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();  
    onSubmit(formData);      
    onClose();               
  };

  return (
    <div className="modal-overlay fullscreen" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Agregar Lote</h3>
        <form onSubmit={handleSubmit} className="form-lote">
          <input
            type="text"
            name="idProducto"
            placeholder="Producto"
            value={formData.idProducto}
            onChange={onChange}
            required
          />
          <input
            type="date"
            name="fechaVencimiento"
            value={formData.fechaVencimiento}
            onChange={onChange}
            required
          />
          <input
            type="number"
            name="cantidadInicial"
            placeholder="Cantidad Inicial"
            value={formData.cantidadInicial}
            onChange={onChange}
            required
          />
          <input
            type="number"
            name="cantidadDisponible"
            placeholder="Cantidad Disponible"
            value={formData.cantidadDisponible}
            readOnly
          />
          <input
            type="number"
            name="precioLote"
            placeholder="Precio Lote"
            value={formData.precioLote}
            onChange={onChange}
            required
          />
          <input
            type="number"
            name="precioUnidad"
            placeholder="Precio Unidad"
            value={formData.precioUnidad}
            readOnly
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

export default LoteForm;
