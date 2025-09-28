import React, { useState } from "react";
import TopBar from "../../TopBar/TopBar";
import Footer from "../../Footer/Footer"; 
import "./MenuPage.css";

// 🔥 Datos simulados (puedes traerlos del backend luego)
const menuData = {
  "Frías": [
    { name: "Granizado de café", price: 8000 },
    { name: "Jugo natural", price: 7000 },
  ],
  "Pa´ Picar": [
    { name: "Empanada de carne", price: 3000 },
    { name: "Empanada de pollo", price: 3200 },
  ],
  "Refrescos": [
    { name: "Coca-Cola", price: 5000 },
    { name: "Sprite", price: 5000 },
  ],
  "Calientes": [
    { name: "Café americano", price: 4500 },
    { name: "Cappuccino", price: 7000 },
  ],
  "Pasteleria": [
    { name: "Pastel de chocolate", price: 9500 },
    { name: "Cheesecake", price: 10000 },
  ],
  "Panaderia": [
    { name: "Croissant", price: 4000 },
    { name: "Pan de queso", price: 3500 },
  ],
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Frías");

  return (
    <div className="menu-page">
      {/* TopBar */}
      <TopBar />

      {/* Hero / Encabezado */}
      <header className="menu-header">
        <h1>Menú</h1>
        <p>Descubre nuestros productos organizados por categoría</p>
      </header>

      {/* Navbar de categorías */}
      <nav className="menu-categories">
        {Object.keys(menuData).map((category) => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Lista de productos */}
      <section className="menu-list">
        <h2>{activeCategory}</h2>
        <ul>
          {menuData[activeCategory].map((item, index) => (
            <li key={index} className="menu-item">
              <span className="item-name">{item.name}</span>
              <span className="item-price">${item.price.toLocaleString("es-CO")}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
