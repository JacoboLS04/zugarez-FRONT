import React from "react";

const InventoryDashboard = ({ products, selectedProduct }) => {
  if (!selectedProduct) return <p>Selecciona un producto</p>;

  const faltante = Math.max(selectedProduct.stockMin - selectedProduct.stock, 0);

  return (
    <div className="inventory-dashboard">
      <h2>Resumen del producto</h2>
      <div className="dashboard-cards">
        <div className="card selected">
          <h3>{selectedProduct.name}</h3>
          <p>Stock disponible:{selectedProduct.stock}</p>
          <p>Stock mínimo:{selectedProduct.stockMin}</p>
          <p><strong>Faltante para el minimo:</strong> {faltante}</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
