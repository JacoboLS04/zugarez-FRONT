import React, { useState } from "react";
import Sidebar from "../SideBar/Sidebar";
import MainContent from "../MainContent";
import "../AdminPage.css";

function AdminLayout() {
  const [activeSection, setActiveSection] = useState("inventario");

  return (
    <div className="admin-layout">
      <Sidebar active={activeSection} onSelect={setActiveSection} />
      <MainContent section={activeSection} />
    </div>
  );
}

export default AdminLayout;
