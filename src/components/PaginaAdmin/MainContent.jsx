import React from "react";
import CrudMongoApp from "../CrudMongoApp/CrudMongoApp";
import InventoryModule from "../Inventario/InventoryModule"; // 👈 importas acá
import "./AdminPage.css";

function MainContent({ section }) {
  return (
    <main className="main-content">
      {section === "inventario" && (
        <div>
          <h1 className="content-title">Gestión de Inventario</h1>
          <InventoryModule /> {/* 👈 aquí se llama */}
        </div>
      )}
      {section === "productos" && (
        <div>
          <h1 className="content-title">Gestión de Productos</h1>
          <CrudMongoApp />
        </div>
      )}
      {section === "nomina" && (
        <h1 className="content-title">Gestión de Nómina</h1>
      )}
    </main>
  );
}

export default MainContent;
