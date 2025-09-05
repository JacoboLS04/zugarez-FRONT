import React, { useState } from "react";
import "./LoteForm.css";

const LoteForm = ({ formData, products, onChange, onClose, onSubmit, loading }) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedProductLabel, setSelectedProductLabel] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleProductChange = (e) => {
    const inputValue = e.target.value;

    // Buscar si coincide con alguno de los productos
    const product = products.find(
      (p) =>
        inputValue === `${p.id} - ${p.name}` || // coincide con el label mostrado
        inputValue === p.name ||                // coincide con solo el nombre
        inputValue === String(p.id)             // coincide con solo el id
    );

    if (product) {
      // Guardar en formData solo el id
      onChange({ target: { name: "productId", value: product.id } });
      // Mostrar en el input "id - nombre"
      setSelectedProductLabel(`${product.id} - ${product.name}`);
    } else {
      // Si no coincide, solo mostramos lo que se escribe
      setSelectedProductLabel(inputValue);
    }
  };

  return (
    <div className="modal-overlay fullscreen" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Agregar Lote</h3>

        <form onSubmit={handleSubmit} className="form-lote">
          {/* Producto */}
          <div className="form-group">
            <label htmlFor="productId">Producto:</label>
            <input
              list="products-list"
              id="productId"
              name="productId"
              value={selectedProductLabel}
              onChange={handleProductChange}
              placeholder="Escriba nombre o ID del producto..."
              required
            />
            <datalist id="products-list">
              {products.map((product) => (
                <option key={product.id} value={`${product.id} - ${product.name}`}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </datalist>
            <small className="select-help-text">
              Escribe para filtrar productos
            </small>
          </div>

          {/* Fecha de Vencimiento */}
          <div className="form-group">
            <label htmlFor="expirationDate">Fecha de Vencimiento:</label>
            <input
              id="expirationDate"
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={onChange}
              min={today}
              required
            />
          </div>

          {/* Cantidad Inicial */}
          <div className="form-group">
            <label htmlFor="initialQuantity">Cantidad Inicial:</label>
            <input
              id="initialQuantity"
              type="number"
              name="initialQuantity"
              value={formData.initialQuantity}
              onChange={onChange}
              min="1"
              required
            />
          </div>

          {/* Cantidad Disponible */}
          <div className="form-group">
            <label htmlFor="availableQuantity">Cantidad Disponible:</label>
            <input
              id="availableQuantity"
              type="number"
              name="availableQuantity"
              value={formData.availableQuantity}
              readOnly
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </div>

          {/* Precio del Lote */}
          <div className="form-group">
            <label htmlFor="batchPrice">Precio del Lote:</label>
            <input
              id="batchPrice"
              type="number"
              name="batchPrice"
              value={formData.batchPrice}
              onChange={onChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Precio por Unidad */}
          <div className="form-group">
            <label htmlFor="unitPrice">Precio por Unidad:</label>
            <input
              id="unitPrice"
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              readOnly
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "⏳ Guardando..." : "💾 Guardar"}
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
