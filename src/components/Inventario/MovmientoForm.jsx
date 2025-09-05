import React, { useState, useEffect } from "react";
import "./MovimientoForm.css";

const MovimientoForm = ({ lotes = [], onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    lote: "",
    tipo: "",
    cantidad: "",
    fecha: new Date().toISOString().split("T")[0],
    motivo: ""
  });

  const [filteredLotes, setFilteredLotes] = useState(lotes);
  const [selectedLoteLabel, setSelectedLoteLabel] = useState("");

  useEffect(() => {
    setFilteredLotes(lotes);
  }, [lotes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  // ✅ Controla la selección del lote con "id - nombre"
  const handleLoteChange = (e) => {
    const inputValue = e.target.value;

    const lote = lotes.find(
      (l) =>
        inputValue === `${l.id} - ${l.product?.name}` ||
        inputValue === l.product?.name ||
        inputValue === String(l.id)
    );

    if (lote) {
      setFormData({ ...formData, lote: lote.id });
      setSelectedLoteLabel(`${lote.id} - ${lote.product?.name}`);
    } else {
      setSelectedLoteLabel(inputValue);
    }
  };

  // Formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return "fecha desconocida";
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-ES");
  };

  // Formato de opción del lote
  const formatLoteOption = (lote) => {
    const productName = lote.product?.name || "Producto desconocido";
    const expirationDate = formatDate(lote.expirationDate);
    return `${lote.id} - ${productName} (${lote.availableQuantity} disponibles, vence ${expirationDate})`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Registrar Movimiento</h3>

        <form onSubmit={handleSubmit} className="form-movimiento">
          {/* Selección de Lote */}
          <div className="form-group">
            <label htmlFor="lote">Lote:</label>
            <input
              list="lotes-list"
              id="lote"
              name="lote"
              value={selectedLoteLabel}
              onChange={handleLoteChange}
              placeholder="Escribe para buscar lote..."
              required
            />
            <datalist id="lotes-list">
              {filteredLotes.map((lote) => (
                <option key={lote.id} value={`${lote.id} - ${lote.product?.name}`}>
                  {formatLoteOption(lote)}
                </option>
              ))}
            </datalist>
            <small className="select-help-text">Escribe nombre o ID del producto</small>
          </div>

          {/* Tipo de Movimiento */}
          <div className="form-group">
            <label htmlFor="tipo">Tipo de Movimiento:</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo</option>
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
              <option value="Ajuste">Ajuste</option>
            </select>
          </div>

          {/* Cantidad */}
          <div className="form-group">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              id="cantidad"
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label htmlFor="fecha">Fecha:</label>
            <input
              id="fecha"
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>

          {/* Motivo */}
          <div className="form-group">
            <label htmlFor="motivo">Motivo:</label>
            <textarea
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Ingrese el motivo del movimiento"
              rows="3"
              required
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

export default MovimientoForm;
