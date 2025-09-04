import React, { useEffect, useState } from "react";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext"; 
import ResponsiveImage from "../../Assest/Support/ResponsiveImage.jsx";
import logo from "../../Assest/Imgs/LogoMin.png";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👈 Nuevo estado

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que quieres cerrar sesión?")) {
      logout();
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="nav-root app-header"
      data-scrolled={scrolled ? "true" : "false"}
    >
      <div className="header-container">
        {/* === IZQUIERDA: Logo + Título === */}
        <div className="header-left nav__brand">
          <span className="nav__brand-text">Zugarez Admin</span>
        </div>

        {/* === DERECHA === */}
        <div className="header-right">
          {/* Desktop: normal */}
          <div className="user-info desktop-only">
            <div className="user-avatar">
              <User />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username || "Usuario"}</span>
              {user?.email && <span className="user-email">{user.email}</span>}
            </div>
          </div>

          <div className="header-actions desktop-only">
            <button className="header-btn" title="Configuración">
              <Settings />
            </button>
            <button
              className="header-btn logout-btn"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut />
            </button>
          </div>

          {/* === Mobile: menú desplegable === */}
          <div className="user-menu mobile-only">
            <button
              className="user-avatar"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
            >
              <User />
              <ChevronDown className={`chevron ${menuOpen ? "open" : ""}`} />
            </button>

            {menuOpen && (
              <div className="user-dropdown">
                <div className="user-details">
                  <span className="user-name">{user?.username || "Usuario"}</span>
                  {user?.email && <span className="user-email">{user.email}</span>}
                </div>
                <button className="header-btn" title="Configuración">
                  <Settings /> Configuración
                </button>
                <button
                  className="header-btn logout-btn"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
