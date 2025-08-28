import React from "react";
import "./ProductList.css";

const ProductList = ({ products, handleEdit, handleCreate, loading }) => {
  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="product-list">
      <button className="btn-add" onClick={handleCreate}>
        ➕ Agregar producto
      </button>

      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleEdit(product)}
          >
            <img
              src={product.urlImage || "https://via.placeholder.com/150"}
              alt={product.name}
            />
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p>${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
