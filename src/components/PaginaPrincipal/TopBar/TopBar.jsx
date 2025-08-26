import { useEffect, useRef, useState } from "react";
import "./TopBar.css";
import ResponsiveImage from "../../Assest/Support/ResponsiveImage.jsx";
import logo from "../../Assest/Imgs/LogoMin.png";

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // NEW: estado de scroll
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // estado inicial al montar
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar al presionar Escape o al clickear fuera
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e) {
      if (!open) return;
      const target = e.target;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClickOutside);
    };
  }, [open]);

  // Cerrar el menú al navegar (móvil)
  function handleNavClick() {
    setOpen(false);
  }


  function scrollToId(id) {
  return (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.querySelector(".nav-root");
    const offset = (header?.offsetHeight || 0) + 5; 

    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });

  };
}

  return (
    <header className="nav-root" data-scrolled={scrolled ? "true" : "false"}>
      <nav className="nav" aria-label="Barra de navegación principal">
        <a className="nav__brand" href="#">
          <ResponsiveImage imagePath={logo} altText="Logo aplicacion" size="small" />
          <span className="nav__brand-text">Zugarez S.A.S</span>
        </a>

        <button
          ref={btnRef}
          className="nav__toggle"
          aria-label="Abrir menú"
          aria-controls="primary-navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__bar" />
          <span className="nav__bar" />
          <span className="nav__bar" />
        </button>

        <div
          ref={menuRef}
          id="primary-navigation"
          className="nav__menu"
          data-open={open ? "true" : "false"}
        >
          <ul className="nav__list" role="menubar">
            <li role="none">
              <a
                role="menuitem"
                href="#nosotros"
                onClick={(e) => {
                  scrollToId("nosotrosTexto")(e);
                  handleNavClick();
                }}
                >
                Nosotros
              </a>
            </li>
            <li role="none">
              <a
                role="menuitem"
                href="#productos"
                onClick={(e) => {
                  scrollToId("PreMenuContainer")(e);
                  handleNavClick();
                }}
                >
                Productos
              </a>
            </li>
            <li role="none">
              <a role="menuitem" href="login"
                onClick={(e) => {
                  scrollToId("login")(e);
                  handleNavClick();
                }}>
                Iniciar Sesión
              </a>
            </li>
            <li role="none">
              <a role="menuitem" href="#contacto"
                onClick={(e) => {
                  scrollToId("contactoRedes")(e);
                  handleNavClick();
                }}>
                Contacto
              </a>
            </li>
          </ul>

          <a
            className="nav__cta"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("authPage");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              handleNavClick();
            }}
          >
            Realizar Pedido
          </a>
        </div>
      </nav>
    </header>
  );
}
