import React, { useState } from "react";
import "./Sidebar.css";
import { Menu, X } from "lucide-react";

function Sidebar({ active, onSelect }) {
  const [open, setOpen] = useState(false);
  const [nominaExpanded, setNominaExpanded] = useState(() => (active || "").startsWith("nomina-"));
  // Robust ADMIN detection: localStorage keys + optional JWT payload
  const isAdmin = (() => {
    const pick = (...vals) => vals.find(v => typeof v === "string" && v.trim().length > 0) || "";
    const fromLocal =
      pick(localStorage.getItem("userRole"), localStorage.getItem("role"), localStorage.getItem("rol"), localStorage.getItem("user_type"));
    const fromUserJson = (() => {
      try {
        const raw = localStorage.getItem("user") || localStorage.getItem("userInfo");
        if (!raw) return "";
        const u = JSON.parse(raw);
        return pick(u?.role, Array.isArray(u?.roles) ? u.roles[0] : u?.roles, Array.isArray(u?.authorities) ? u.authorities[0] : u?.authorities);
      } catch {
        return "";
      }
    })();
    const fromJwt = (() => {
      const t = localStorage.getItem("token");
      if (!t || !t.includes(".")) return "";
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        return pick(
          payload?.role,
          Array.isArray(payload?.roles) ? payload.roles[0] : payload?.roles,
          Array.isArray(payload?.authorities) ? payload.authorities[0] : payload?.authorities
        );
      } catch {
        return "";
      }
    })();
    const roleRaw = pick(fromLocal, fromUserJson, fromJwt);
    return String(roleRaw).toLowerCase().includes("admin");
  })();

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

          {/* Sección Nómina (visible si el rol contiene "admin") */}
          {isAdmin && (
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
