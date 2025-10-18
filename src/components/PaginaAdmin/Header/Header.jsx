import React, { useEffect, useState } from "react";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext"; 
import ResponsiveImage from "../../Assest/Support/ResponsiveImage.jsx";
import logo from "../../Assest/Imgs/LogoMin.png";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false); // nuevo estado para modal
  const [showUnsubscribeForm, setShowUnsubscribeForm] = useState(false); // estado para formulario de baja

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

  // abrir modal de info de usuario
  const openUserModal = () => setUserModalOpen(true);
  const closeUserModal = () => setUserModalOpen(false);

  /* -----------------------
     Nuevo: formulario de baja
     ----------------------- */
  const UnsubscribeForm = ({ defaultEmail = "", onCancel, onDone }) => {
    const [form, setForm] = useState({ name: "", email: defaultEmail || "", password: "", reason: "" });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!form.name.trim() || !form.email.trim() || !form.reason.trim() || !form.password.trim()) {
        alert("Por favor completa todos los campos.");
        return;
      }
      if (!window.confirm("Esta acción solicitará la baja. ¿Confirmas?")) return;

      setSending(true);
      try {
        // placeholder: sustituir por tu endpoint real
        await fetch("/api/request-account-unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        alert("Solicitud de baja enviada. Revisaremos tu petición.");
        onDone?.();
      } catch (err) {
        console.error(err);
        alert("Ocurrió un error al enviar la solicitud.");
      } finally {
        setSending(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="unsubscribe-form" style={{ display: "grid", gap: 10 }}>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Correo
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        <label>
          Motivo
          <textarea name="reason" value={form.reason} onChange={handleChange} rows="3" required />
        </label>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancel} className="header-btn" style={{ padding: "8px 12px", borderRadius: 8 }}>
            Cancelar
          </button>
          <button type="submit" className="header-btn logout-btn" disabled={sending} style={{ padding: "8px 12px", borderRadius: 8 }}>
            {sending ? "Enviando..." : "Solicitar baja"}
          </button>
        </div>
      </form>
    );
  };

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
            <button className="header-btn" title="Configuración" onClick={openUserModal}>
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
                <button className="header-btn" title="Configuración" onClick={openUserModal}>
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

      {/* Modal de info de usuario (modificado para incluir el formulario de baja) */}
      {userModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
            padding: 16,
          }}
          onClick={closeUserModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 460,
              maxWidth: "100%",
              background: "#fff",
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              color: "#2C3E50",
            }}
          >
            <h3 id="user-modal-title" style={{ marginTop: 0 }}>Información del usuario</h3>

            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{user?.username || "Usuario"}</div>
              {user?.email && <div style={{ color: "#6c757d" }}>{user.email}</div>}
              {user?.name && <div style={{ color: "#6c757d" }}>{user.name}</div>}
            </div>

            {/* Mostrar formulario de baja si se solicitó, sino botones */}
            {showUnsubscribeForm ? (
              <UnsubscribeForm
                defaultEmail={user?.email || ""}
                onCancel={() => setShowUnsubscribeForm(false)}
                onDone={() => {
                  setShowUnsubscribeForm(false);
                  closeUserModal();
                }}
              />
            ) : (
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  onClick={() => setShowUnsubscribeForm(true)}
                  className="header-btn logout-btn"
                  style={{ background: "transparent", border: "1px solid rgba(44,62,80,0.08)", color: "#E67E22", padding: "8px 12px", borderRadius: 8 }}
                  title="Darse de baja"
                >
                  Darse de baja
                </button>

                <button
                  onClick={closeUserModal}
                  className="header-btn"
                  style={{ padding: "8px 12px", borderRadius: 8 }}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// ------------------------------------------------------------------
// TopBar reutilizable: también permite abrir el modal de usuario
// ------------------------------------------------------------------
export const TopBar = ({ showLogo = true }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [showUnsubscribeForm, setShowUnsubscribeForm] = useState(false); // estado para formulario de baja

  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) logout();
  };

  const openUserModal = () => setUserModalOpen(true);
  const closeUserModal = () => setUserModalOpen(false);

  return (
    <div className="topbar-root" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'8px 12px',background:'transparent'}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {showLogo && (
          <img src={logo} alt="Zugarez" style={{height:34}} />
        )}
        <div style={{display:'flex',flexDirection:'column'}}>
          <span style={{fontWeight:700,color:'#2C3E50'}}>{user?.username || 'Invitado'}</span>
          {user?.email && <small style={{color:'#6c757d'}}>{user.email}</small>}
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          title="Menú"
          className="header-btn"
          style={{display:'flex',alignItems:'center',gap:6}}
        >
          <User /> {open ? 'Cerrar' : 'Perfil'}
        </button>
        <button onClick={handleLogout} className="header-btn logout-btn" title="Cerrar sesión" style={{display:'flex',alignItems:'center',gap:8}}>
          <LogOut /> Salir
        </button>

        <button className="header-btn" title="Configuración" onClick={openUserModal} style={{marginLeft:6}}>
          <Settings />
        </button>
      </div>

      {/* Modal reutilizable dentro de TopBar */}
      {userModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-modal-title-topbar"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
            padding: 16,
          }}
          onClick={closeUserModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,
              maxWidth: "100%",
              background: "#fff",
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              color: "#2C3E50",
            }}
          >
            <h3 id="user-modal-title-topbar" style={{ marginTop: 0 }}>Información del usuario</h3>

            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{user?.username || "Usuario"}</div>
              {user?.email && <div style={{ color: "#6c757d" }}>{user.email}</div>}
              {user?.name && <div style={{ color: "#6c757d" }}>{user.name}</div>}
            </div>

            {/* Mostrar formulario de baja si se solicitó, sino botones */}
            {showUnsubscribeForm ? (
              <UnsubscribeForm
                defaultEmail={user?.email || ""}
                onCancel={() => setShowUnsubscribeForm(false)}
                onDone={() => {
                  setShowUnsubscribeForm(false);
                  closeUserModal();
                }}
              />
            ) : (
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  onClick={() => setShowUnsubscribeForm(true)}
                  className="header-btn logout-btn"
                  style={{ background: "transparent", border: "1px solid rgba(44,62,80,0.08)", color: "#E67E22", padding: "8px 12px", borderRadius: 8 }}
                  title="Darse de baja"
                >
                  Darse de baja
                </button>

                <button onClick={closeUserModal} className="header-btn" style={{ padding: "8px 12px", borderRadius: 8 }}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
