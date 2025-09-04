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
}) => {
  
  // Debug COMPLETO: mostrar TODO el objeto
  console.log("=== DEBUG COMPLETO ProductForm ===");
  console.log("formData RAW:", JSON.stringify(formData, null, 2));
  console.log("Todas las keys:", Object.keys(formData));
  console.log("=== Valores individuales ===");
  for (const [key, value] of Object.entries(formData)) {
    console.log(`${key}: "${value}" (tipo: ${typeof value})`);
  }
  console.log("=== FIN DEBUG COMPLETO ===");
  
  // Función para validar y procesar datos antes de enviar
  const validateAndSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.supplierId || formData.supplierId.toString().trim() === '') {
      alert('Por favor ingresa un ID de proveedor válido');
      return;
    }
    
    if (!formData.name || formData.name.trim() === '') {
      alert('Por favor ingresa un nombre para el producto');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Por favor ingresa un precio válido');
      return;
    }
    
    // Convertir supplierId a número antes de enviar
    const dataToSend = {
      ...formData,
      supplierId: parseInt(formData.supplierId, 10),
      price: parseFloat(formData.price)
    };
    
    console.log("=== DATOS A ENVIAR ===");
    console.log("dataToSend:", dataToSend);
    
    handleSubmit(dataToSend);
  };

  return (
    <div className="crud-bg">
      <div className="product-form-container">
        <div className="product-form-card">
          <div className="product-form-header">{title}</div>
          
          <form className="product-form-body" onSubmit={validateAndSubmit}>
            {/* === FILA 1: Nombre y Precio === */}
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  placeholder="Ej. Café Espresso"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Ej. 8500"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* === FILA 2: Marca y Proveedor === */}
            <div className="form-row">
              <div className="form-group">
                <label>Marca *</label>
                <input
                  type="text"
                  placeholder="Ej. Coca-Cola"
                  value={formData.brand || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>ID Proveedor *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej. 101"
                  value={formData.supplierId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, supplierId: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                placeholder="Describe el producto..."
                rows="3"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            {/* URL Imagen */}
            <div className="form-group">
              <label>URL Imagen *</label>
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.urlImage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, urlImage: e.target.value })
                }
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
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBack}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;