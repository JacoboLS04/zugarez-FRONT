import React from "react";
import "./LoteForm.css";

const LoteForm = ({ formData, products, onChange, onClose, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay fullscreen" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Agregar Lote</h3>
        <form onSubmit={handleSubmit} className="form-lote">
          
          {/* Selector de Producto */}
          <select
            name="productId"
            value={formData.productId}
            onChange={onChange}
            required
          >
            <option value="">Seleccionar Producto</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>

          {/* Fecha de Vencimiento */}
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={onChange}
            min={today}
            required
          />

          {/* Cantidad Inicial */}
          <input
            type="number"
            name="initialQuantity"
            placeholder="Cantidad Inicial"
            value={formData.initialQuantity}
            onChange={onChange}
            min="1"
            required
          />

          {/* Cantidad Disponible (readonly) */}
          <input
            type="number"
            name="availableQuantity"
            placeholder="Cantidad Disponible"
            value={formData.availableQuantity}
            readOnly
            style={{backgroundColor: '#f5f5f5'}}
          />

          {/* Precio del Lote */}
          <input
            type="number"
            step="0.01"
            name="batchPrice"
            placeholder="Precio Lote"
            value={formData.batchPrice}
            onChange={onChange}
            min="0"
            required
          />

          {/* Precio por Unidad (readonly) */}
          <input
            type="number"
            step="0.01"
            name="unitPrice"
            placeholder="Precio Unidad"
            value={formData.unitPrice}
            readOnly
            style={{backgroundColor: '#f5f5f5'}}
          />

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Guardando...' : '💾 Guardar'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoteForm;