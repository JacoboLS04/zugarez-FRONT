import React, { useState } from "react";
import LotesModule from "./LotesModule";
import "./InventoryModule.css";
import MovimientosModule from "./MovimientosModule";
import Inventario from "./InventarioReal/Inventario";
import RemisionesModule from "./RemisionesModule";

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

        <button
          className={activeTab === "remisiones" ? "active" : ""}
          onClick={() => setActiveTab("remisiones")}
        >
          Remisiones
        </button>
      </div>

      {/* Contenido dinámico */}
      <div className="inventory-content">
        {activeTab === "inventario" && <h2><Inventario /></h2>}
        {activeTab === "lotes" && <LotesModule />}
        {activeTab === "movimientos" && <h2> <MovimientosModule/> </h2>}
        {activeTab === "remisiones" && <h2><RemisionesModule/></h2>}
      </div>
    </div>
  );
};

export default InventoryModule;
