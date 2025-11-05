import React, { useState } from "react";
import Sidebar from "../SideBar/Sidebar";
import MainContent from "../MainContent";
import "../AdminPage.css";
// import { useLocation, useNavigate } from "react-router-dom"; // removed
import EmpleadosPage from "../../../pages/admin/nomina/EmpleadosPage";
import AsistenciaPage from "../../../pages/admin/nomina/AsistenciaPage";
import CalcularNominaPage from "../../../pages/admin/nomina/CalcularNominaPage";
import GestionNominasPage from "../../../pages/admin/nomina/GestionNominasPage";
import ReportesPage from "../../../pages/admin/nomina/ReportesPage";

function AdminLayout() {
  const [activeSection, setActiveSection] = useState("inventario");
  // const location = useLocation?.();
  // const navigate = useNavigate?.();

  // ...existing code...
  // REMOVED: sectionKeyToPath, pathToSectionKey and effects syncing/redirection

  // Maneja selección del Sidebar: solo set state (sin navegación)
  const handleSelect = (key) => {
    setActiveSection(key);
  };

  const renderNomina = () => {
    switch (activeSection) {
      case "nomina-empleados": return <EmpleadosPage />;
      case "nomina-asistencia": return <AsistenciaPage />;
      case "nomina-calcular": return <CalcularNominaPage />;
      case "nomina-gestion": return <GestionNominasPage />;
      case "nomina-reportes": return <ReportesPage />;
      default: return null;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar active={activeSection} onSelect={handleSelect} />
      {activeSection.startsWith("nomina-") ? renderNomina() : <MainContent section={activeSection} />}
    </div>
  );
}

export default AdminLayout;
