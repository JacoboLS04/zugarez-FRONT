import React, { useState } from "react";
import "./Sidebar.css";
import { Menu, X } from "lucide-react";

function Sidebar({ active, onSelect }) {
  const [open, setOpen] = useState(false);
  const [nominaExpanded, setNominaExpanded] = useState(() => (active || "").startsWith("nomina-"));
  const userRole = localStorage.getItem("userRole");

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
            className={`sidebar__item ${active === "pedidos" ? "active" : ""}`}
            onClick={() => {
              onSelect("pedidos");
              setOpen(false);
            }}
          >
            Pedidos
          </li>

          {/* NEW: Sección Nómina (solo ADMIN) */}
          {userRole === "ADMIN" && (
            <div className="menu-section-nomina">
              <button
                className="menu-toggle sidebar__item"
                onClick={() => setNominaExpanded((v) => !v)}
              >
                <span>💰 Nómina</span>
                <span className={`arrow ${nominaExpanded ? "expanded" : ""}`}>▼</span>
              </button>

              {nominaExpanded && (
                <div className="submenu">
                  <div
                    className={`submenu-item ${active === "nomina-empleados" ? "active" : ""}`}
                    onClick={() => {
                      onSelect("nomina-empleados");
                      setOpen(false);
                    }}
                  >
                    👥 Empleados
                  </div>
                  <div
                    className={`submenu-item ${active === "nomina-asistencia" ? "active" : ""}`}
                    onClick={() => {
                      onSelect("nomina-asistencia");
                      setOpen(false);
                    }}
                  >
                    🕐 Asistencia
                  </div>
                  <div
                    className={`submenu-item ${active === "nomina-calcular" ? "active" : ""}`}
                    onClick={() => {
                      onSelect("nomina-calcular");
                      setOpen(false);
                    }}
                  >
                    🧮 Calcular Nómina
                  </div>
                  <div
                    className={`submenu-item ${active === "nomina-gestion" ? "active" : ""}`}
                    onClick={() => {
                      onSelect("nomina-gestion");
                      setOpen(false);
                    }}
                  >
                    📊 Gestión de Nóminas
                  </div>
                  <div
                    className={`submenu-item ${active === "nomina-reportes" ? "active" : ""}`}
                    onClick={() => {
                      onSelect("nomina-reportes");
                      setOpen(false);
                    }}
                  >
                    📈 Reportes
                  </div>
                </div>
              )}
            </div>
          )}
        </ul>
      </aside>

      {/* Overlay (solo visible en móvil al abrir menú) */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}

export default Sidebar;
