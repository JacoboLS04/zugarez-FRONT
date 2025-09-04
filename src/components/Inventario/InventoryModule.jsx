import React, { useState } from "react";
import LotesModule from "./LotesModule";
import "./InventoryModule.css";
import MovimientosModule from "./MovimientosModule";

const InventoryModule = () => {
  const [activeTab, setActiveTab] = useState("inventario");

  return (
    <div className="inventory-module">
      {/* Tabs */}
      <div className="inventory-tabs">
        <button
          className={activeTab === "inventario" ? "active" : ""}
          onClick={() => setActiveTab("inventario")}
        >
          Inventario
        </button>
        <button
          className={activeTab === "lotes" ? "active" : ""}
          onClick={() => setActiveTab("lotes")}
        >
          Lotes
        </button>
        <button
          className={activeTab === "movimientos" ? "active" : ""}
          onClick={() => setActiveTab("movimientos")}
        >
          Movimientos
        </button>
      </div>

      {/* Contenido dinámico */}
      <div className="inventory-content">
        {activeTab === "inventario" && <h2>Inventario</h2>}
        {activeTab === "lotes" && <LotesModule />}
        {activeTab === "movimientos" && <h2> <MovimientosModule/> </h2>}
      </div>
    </div>
  );
};

export default InventoryModule;
