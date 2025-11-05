import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/Sidebar";
import MainContent from "../MainContent";
import "../AdminPage.css";
import { useLocation, useNavigate } from "react-router-dom";

function AdminLayout() {
  const [activeSection, setActiveSection] = useState("inventario");
  const location = useLocation?.();
  const navigate = useNavigate?.();

  // Mapea keys de Sidebar <-> rutas
  const sectionKeyToPath = (key) => {
    switch (key) {
      case "inventario": return "/admin/inventario";
      case "productos": return "/admin/productos";
      case "pedidos": return "/admin/pedidos";
      case "nomina-empleados": return "/admin/nomina/empleados";
      case "nomina-asistencia": return "/admin/nomina/asistencia";
      case "nomina-calcular": return "/admin/nomina/calcular";
      case "nomina-gestion": return "/admin/nomina/gestion";
      case "nomina-reportes": return "/admin/nomina/reportes";
      default: return null;
    }
  };

  const pathToSectionKey = (path) => {
    if (!path) return "inventario";
    if (path.includes("/admin/nomina/empleados")) return "nomina-empleados";
    if (path.includes("/admin/nomina/asistencia")) return "nomina-asistencia";
    if (path.includes("/admin/nomina/calcular")) return "nomina-calcular";
    if (path.includes("/admin/nomina/gestion")) return "nomina-gestion";
    if (path.includes("/admin/nomina/reportes")) return "nomina-reportes";
    if (path.includes("/admin/productos")) return "productos";
    if (path.includes("/admin/pedidos")) return "pedidos";
    return "inventario";
  };

  // Al cambiar la URL, actualiza la sección activa
  useEffect(() => {
    if (location?.pathname?.startsWith?.("/admin")) {
      setActiveSection(pathToSectionKey(location.pathname));
    }
  }, [location?.pathname]);

  // Redirige a /admin/inventario cuando la ruta sea exactamente /admin
  useEffect(() => {
    if (navigate && location?.pathname && /^\/admin\/?$/.test(location.pathname)) {
      navigate("/admin/inventario", { replace: true });
    }
  }, [location?.pathname, navigate]);

  // Maneja selección del Sidebar: set state + navegar si hay router
  const handleSelect = (key) => {
    setActiveSection(key);
    const path = sectionKeyToPath(key);
    if (navigate && path) navigate(path, { replace: false });
  };

  return (
    <div className="admin-layout">
      <Sidebar active={activeSection} onSelect={handleSelect} />
      <MainContent section={activeSection} />
    </div>
  );
}

export default AdminLayout;
