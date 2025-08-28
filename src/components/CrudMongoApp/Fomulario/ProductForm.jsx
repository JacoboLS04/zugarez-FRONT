import React from "react";
import "./ProductForm.css";

const ProductForm = ({
  title,
  formData,
  setFormData,
  handleSubmit,
  handleBack,
  isEdit,
  handleDelete
}) => (
  <div className="crud-bg">
    <div className="product-form-container">
      <div className="product-form-card">
        <div className="product-form-header">{title}</div>
        <form
          className="product-form-body"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Ej. Café Espresso"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Precio */}
          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej. 8500"
              value={formData.price || ""}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          {/* URL Imagen */}
          <div className="form-group">
            <label>URL Imagen</label>
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.urlImage || ""}
              onChange={(e) => setFormData({ ...formData, urlImage: e.target.value })}
              required
            />
            {formData.urlImage && (
              <div className="image-preview">
                <img src={formData.urlImage} alt="preview" />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {isEdit ? "💾 Guardar cambios" : "➕ Agregar producto"}
            </button>
            {isEdit && (
              <button
                type="button"
                className="btn-delete"
                onClick={handleDelete}
              >
                🗑️ Eliminar
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={handleBack}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default ProductForm;
