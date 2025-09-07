import React, { useState, useEffect } from "react";
import "./LoteForm.css";

const LoteForm = ({ formData, products, onChange, onClose, onSubmit, loading }) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedProductLabel, setSelectedProductLabel] = useState("");

  // Estados solo para mostrar el texto formateado en los inputs de precio
  const [batchPriceDisplay, setBatchPriceDisplay] = useState("");
  const [unitPriceDisplay, setUnitPriceDisplay] = useState("");

  // ===== Helpers de formato/parseo COP =====
  const formatCOP = (num) => {
    if (num == null || num === "") return "";
    // Asegurar número
    const value = Number(num);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(isNaN(value) ? 0 : value);
  };

  // Quita $ . , espacios y todo lo no numérico. Devuelve number en pesos.
  const parseCurrencyToNumber = (text) => {
    if (!text) return 0;
    const digits = String(text).replace(/[^\d]/g, ""); // solo dígitos
    return digits ? Number(digits) : 0;
  };

  // Al montar/actualizar formData sincronizar displays
  useEffect(() => {
    setBatchPriceDisplay(formatCOP(formData.batchPrice || 0));
    setUnitPriceDisplay(formatCOP(formData.unitPrice || 0));
  }, [formData.batchPrice, formData.unitPrice]);

  // Recalcular unitPrice cada vez que cambie batchPrice o initialQuantity
  useEffect(() => {
    const qty = Number(formData.initialQuantity || 0);
    const batch = Number(formData.batchPrice || 0);
    const unit = qty > 0 ? Math.floor(batch / qty) : 0; // redondeo hacia abajo
    // Si cambió, actualiza estado y formData
    if (unit !== Number(formData.unitPrice || 0)) {
      setUnitPriceDisplay(formatCOP(unit));
      onChange({ target: { name: "unitPrice", value: unit } });
    }
  }, [formData.batchPrice, formData.initialQuantity]); // eslint-disable-line

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  // ===== Producto con datalist (tu mismo flujo) =====
  const handleProductChange = (e) => {
    const inputValue = e.target.value;
    const product = products.find(
      (p) =>
        inputValue === `${p.id} - ${p.name}` ||
        inputValue === p.name ||
        inputValue === String(p.id)
    );

    if (product) {
      onChange({ target: { name: "productId", value: product.id } });
      setSelectedProductLabel(`${product.id} - ${product.name}`);
    } else {
      setSelectedProductLabel(inputValue);
    }
  };

  // ===== Manejo de precios con máscara =====
  const handleBatchPriceChange = (e) => {
    const text = e.target.value;
    const num = parseCurrencyToNumber(text);
    // Actualiza lo que se muestra
    setBatchPriceDisplay(formatCOP(num));
    // Guarda número limpio en formData
    onChange({ target: { name: "batchPrice", value: num } });
  };

  // Si quieres permitir edición manual de unitPrice, usa esta función.
  // En tu UI está readOnly, pero igual dejamos el handler por si luego habilitas edición.
  const handleUnitPriceChange = (e) => {
    const text = e.target.value;
    const num = parseCurrencyToNumber(text);
    setUnitPriceDisplay(formatCOP(num));
    onChange({ target: { name: "unitPrice", value: num } });
  };

  // Interceptamos el cambio de cantidad para recalcular inmediatamente
  const handleInitialQuantityChange = (e) => {
    const value = e.target.value;
    onChange(e); // actualiza cantidad
    // El efecto useEffect recalculará unitPrice
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
            <small className="select-help-text">Escribe para filtrar productos</small>
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

          {/* Fila de Cantidades */}
          <div className="form-row">
            {/* Cantidad Inicial */}
            <div className="form-group">
              <label htmlFor="initialQuantity">Cantidad Inicial:</label>
              <input
                id="initialQuantity"
                type="number"
                name="initialQuantity"
                value={formData.initialQuantity}
                onChange={handleInitialQuantityChange}
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
          </div>

          {/* Fila de Precios */}
          <div className="form-row">
            {/* Precio del Lote */}
            <div className="form-group">
              <label htmlFor="batchPrice">Precio del Lote:</label>
              <input
                id="batchPrice"
                type="text"
                name="batchPrice_display"
                value={batchPriceDisplay}
                onChange={handleBatchPriceChange}
                inputMode="numeric"
                placeholder="$ 0"
                required
              />
            </div>

            {/* Precio por Unidad */}
            <div className="form-group">
              <label htmlFor="unitPrice">Precio por Unidad:</label>
              <input
                id="unitPrice"
                type="text"
                name="unitPrice_display"
                value={unitPriceDisplay}
                onChange={handleUnitPriceChange}
                readOnly
                style={{ backgroundColor: "#f5f5f5" }}
                placeholder="$ 0"
              />
            </div>
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
