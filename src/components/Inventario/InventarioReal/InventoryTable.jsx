import React, { useState, useEffect } from "react";

const InventoryTable = ({ products, onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Actualizar productos filtrados cuando cambian los criterios
  useEffect(() => {
    let result = [...products];
    console.log(products);

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      let compareA = a[sortBy];
      let compareB = b[sortBy];

      // Si ordenamos por texto, ignoramos mayúsculas/minúsculas
      if (typeof compareA === "string") {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, sortBy, sortDirection]);

  const handleRowClick = (product) => {
    setSelectedId(product.id);
    onSelect(product);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Si ya estamos ordenando por este campo, cambiamos la dirección
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Si es un campo nuevo, ordenamos ascendentemente
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Función para mostrar indicador de orden
  const getSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="inventory-table">
      <h2>Productos en Inventario</h2>

      {/* Controles de filtrado */}
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Buscar por nombre o marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              ID{getSortIndicator("id")}
            </th>
            <th onClick={() => handleSort("name")}>
              Producto{getSortIndicator("name")}
            </th>
            <th onClick={() => handleSort("brand")}>
              Marca{getSortIndicator("brand")}
            </th>
            <th onClick={() => handleSort("stock")}>
              Stock disponible{getSortIndicator("stock")}
            </th>
            <th onClick={() => handleSort("stock_minimo")}>
              Stock Mínimo{getSortIndicator("stock_minimo")}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr
              key={p.id}
              onClick={() => handleRowClick(p)}
              className={selectedId === p.id ? "selected" : ""}
            >
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.stock}</td>
              <td>{p.stock_minimo || 0}</td>
            </tr>
          ))}
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="5" className="no-results">
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
