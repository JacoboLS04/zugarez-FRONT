import React from "react";
import CrudMongoApp from "../CrudMongoApp/CrudMongoApp";
import InventoryModule from "../Inventario/InventoryModule"; // 👈 importas acá
import "./AdminPage.css";
import OrdersApp from "../OrdersApp/OrdersApp";

function MainContent({ section }) {
  return (
    <main className="main-content">
      {section === "inventario" && (
        <div>
          <h1 className="content-title">Gestión de Inventario</h1>
          <InventoryModule /> 
        </div>
      )}
      {section === "productos" && (
        <div>
          <h1 className="content-title">Gestión de Productos</h1>
          <CrudMongoApp />
        </div>
      )}
      {section === "pedidos" && (
        <div>
          <h1 className="content-title">Gestión de Pedidos</h1>
          < OrdersApp/>
        </div>
      )}
      {section === "nomina" && (
        <h1 className="content-title">Gestión de Nómina</h1>
      )}
    </main>
  );
}

export default MainContent;
