import React, { useState } from "react";
import InventoryDashboard from "./InventoryDashboard";
import InventoryTable from "./InventoryTable";
import "./Inventario.css";

const Inventario = () => {
  // Datos simulados (se deben remplazar con fetch)
  const [products] = useState([
    { id: 1, name: "Coca-Cola", brand: "Coca-Cola", stock: 120, stockMin: 50 },
    { id: 2, name: "Empanada", brand: "Local", stock: 40, stockMin: 30 },
    { id: 3, name: "Agua", brand: "Coca-Cola", stock: 200, stockMin: 60 },
    { id: 4, name: "Galletas Oreo", brand: "Oreo", stock: 15, stockMin: 25 },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  return (
    <div className="inventory-module">
      {/* Dashboard arriba */}
      <InventoryDashboard products={products} selectedProduct={selectedProduct} />

      {/* Tabla abajo */}
      <InventoryTable products={products} onSelect={setSelectedProduct} />
    </div>
  );
};

export default Inventario;
