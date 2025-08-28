import React from "react";
import "./AdminPage.css";
import CrudMongoApp from "../CrudMongoApp/CrudMongoApp";

function MainContent({ section }) {
  return (
    <main className="main-content">
      {section === "inventario" && (
        <h1 className="content-title">Gestión de Inventario</h1>
      )}
      {section === "productos" && (
        <div>
            <h1 className="content-title">Gestión de Productos</h1>
            <CrudMongoApp/>
        </div>
        
        
      )}
      {section === "nomina" && (
        <h1 className="content-title">Gestión de Nómina</h1>
      )}
      
    </main>
  );
}

export default MainContent;
