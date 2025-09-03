import React, { useState } from "react";
import LotesModule from "./Lotes/Modulo/LotesModule";
// (luego importarás DashboardModule y MovimientosModule)
import "./InventoryModule.css";
import MovimientosModule from "./Movimientos/MovimientosModule";

const InventoryModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="inventory-module">
      <div className="inventory-tabs">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
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
        {activeTab === "dashboard" && <h2>Aquí va el Dashboard</h2>}
        {activeTab === "lotes" && <LotesModule />}
        {activeTab === "movimientos" && <h2> <MovimientosModule/> </h2>}
      </div>
    </div>
  );
};

export default InventoryModule;
