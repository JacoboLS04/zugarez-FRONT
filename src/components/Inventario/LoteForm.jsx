import React from "react";
import "./LoteForm.css";

<<<<<<< HEAD
const LoteForm = ({ formData, products, onChange, onClose, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const today = new Date().toISOString().split('T')[0];

=======
const LoteForm = ({ formData, onChange, onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();      // ✅ el evento se controla aquí
    onSubmit(formData);      // ✅ solo pasamos los datos al padre
    onClose();               // ✅ cerramos modal
  };

>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
  return (
    <div className="modal-overlay fullscreen" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Agregar Lote</h3>
        <form onSubmit={handleSubmit} className="form-lote">
<<<<<<< HEAD
          
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
=======
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
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default LoteForm;
=======
export default LoteForm;
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
