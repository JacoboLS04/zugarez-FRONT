import React, { useState } from "react";
import "./ProductList.css";

const ProductList = ({ products, handleEdit, handleCreate, loading }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("name"); // Nuevo estado para ordenamiento

  if (loading) return <p>Cargando productos...</p>;

  // Filtrado y búsqueda mejorado
  const filteredProducts = products.filter((product) => {
    // Búsqueda por nombre
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    // Filtrado mejorado
    let matchesFilter = true;
    
    if (filter !== "todos") {
      switch (filter) {
        case "marca":
          // Solo mostrar productos que tengan marca definida
          matchesFilter = product.brand && product.brand.trim() !== "";
          break;
        case "proveedor":
          // Solo mostrar productos que tengan proveedor definido
          matchesFilter = product.supplierId && product.supplierId > 0;
          break;
        case "precio":
          // Solo mostrar productos con precio mayor a 0
          matchesFilter = product.price && parseFloat(product.price) > 0;
          break;
        case "precio_alto":
          // Productos con precio mayor a 10000
          matchesFilter = product.price && parseFloat(product.price) > 10000;
          break;
        case "precio_bajo":
          // Productos con precio menor o igual a 10000
          matchesFilter = product.price && parseFloat(product.price) <= 10000;
          break;
        default:
          matchesFilter = true;
      }
    }

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Ordenamiento
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price_asc":
        return parseFloat(a.price || 0) - parseFloat(b.price || 0);
      case "price_desc":
        return parseFloat(b.price || 0) - parseFloat(a.price || 0);
      case "brand":
        return (a.brand || "").localeCompare(b.brand || "");
      default:
        return 0;
    }
  });

  // Obtener estadísticas para mostrar
  const stats = {
    total: products.length,
    filtered: filteredProducts.length,
    brands: [...new Set(products.map(p => p.brand).filter(Boolean))].length,
    suppliers: [...new Set(products.map(p => p.supplierId).filter(Boolean))].length
  };

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
          <option value="todos">📋 Todos ({products.length})</option>
          <option value="marca">🏷️ Con Marca ({stats.brands} marcas)</option>
          <option value="proveedor">🏪 Con Proveedor ({stats.suppliers} proveedores)</option>
          <option value="precio">💰 Con Precio</option>
          <option value="precio_alto">💎 Precio Alto (&gt;$10,000)</option>
          <option value="precio_bajo">💵 Precio Bajo (≤$10,000)</option>
        </select>

        {/* Ordenar */}
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">🔤 Ordenar por Nombre</option>
          <option value="price_asc">💰⬆️ Precio: Menor a Mayor</option>
          <option value="price_desc">💰⬇️ Precio: Mayor a Menor</option>
          <option value="brand">🏷️ Por Marca</option>
        </select>
      </div>

      {/* Mostrar estadísticas de filtrado */}
      {(search || filter !== "todos") && (
        <div className="filter-stats">
          Mostrando {filteredProducts.length} de {products.length} productos
          {search && ` • Búsqueda: "${search}"`}
          {filter !== "todos" && ` • Filtro: ${filter}`}
          {(search || filter !== "todos") && (
            <button 
              className="clear-filters"
              onClick={() => {
                setSearch("");
                setFilter("todos");
              }}
            >
              ✖️ Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* === GRID DE PRODUCTOS === */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleEdit(product)}
            >
              <div className="product-image">
                <img
                  src={product.urlImage || "https://via.placeholder.com/150"}
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-price">${parseFloat(product.price || 0).toLocaleString()}</p>
                {product.brand && <p className="product-supplier">🏷️ {product.brand}</p>}
                {product.supplierId && <p className="product-supplier">🏪 Proveedor: {product.supplierId}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron productos</p>
            {(search || filter !== "todos") && (
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSearch("");
                  setFilter("todos");
                }}
              >
                Ver todos los productos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;