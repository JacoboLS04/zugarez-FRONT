import React, { useState } from "react";
import "./ProductList.css";

const ProductList = ({ products, handleEdit, handleCreate, loading }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  if (loading) return <p>Cargando productos...</p>;

  // Filtrado y búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "todos" ||
      (filter === "marca" && product.brand) ||
      (filter === "proveedor" && product.id_supplier) ||
      (filter === "precio" && product.price);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="product-list">
      {/* === ACCIONES SUPERIORES === */}
      <div className="product-actions">
        {/* Botón Crear */}
        <button className="btn-addProduct" onClick={handleCreate}>
          ➕ Agregar producto
        </button>

        {/* Buscar */}
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filtrar */}
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="marca">Por Marca</option>
          <option value="proveedor">Por Proveedor</option>
          <option value="precio">Por Precio</option>
        </select>
      </div>

      {/* === GRID DE PRODUCTOS === */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          ))
        ) : (
          <p className="no-results">No se encontraron productos</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
