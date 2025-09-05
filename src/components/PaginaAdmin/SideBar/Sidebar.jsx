import React, { useState } from "react";
import "./Sidebar.css";
import { Menu, X } from "lucide-react";

function Sidebar({ active, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa (solo móvil) */}
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h2 className="sidebar__title">Administrador</h2>
        <ul className="sidebar__list">
          <li
            className={`sidebar__item ${active === "inventario" ? "active" : ""}`}
            onClick={() => {
              onSelect("inventario");
              setOpen(false);
            }}
          >
            Inventario
          </li>
          <li
            className={`sidebar__item ${active === "productos" ? "active" : ""}`}
            onClick={() => {
              onSelect("productos");
              setOpen(false);
            }}
          >
            Productos
          </li>
          <li
            className={`sidebar__item ${active === "nomina" ? "active" : ""}`}
            onClick={() => {
              onSelect("nomina");
              setOpen(false);
            }}
          >
            Nómina (Proximamente)
          </li>
        </ul>
      </aside>

      {/* Overlay (solo visible en móvil al abrir menú) */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}

export default Sidebar;
