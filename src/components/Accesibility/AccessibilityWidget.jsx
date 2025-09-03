import React, { useState, useEffect } from "react";
import { Eye, Plus, Minus, RefreshCcw } from "lucide-react";
import "./AccessibilityWidget.css";

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // % del tamaño base
  const [isGrayscale, setIsGrayscale] = useState(false);

  // Aplica cambios globales al body
  useEffect(() => {
    document.body.style.filter = isGrayscale ? "grayscale(100%)" : "none";
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize, isGrayscale]);

  const increaseFont = () => setFontSize((prev) => Math.min(prev + 10, 200));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 10, 50));
  const toggleGrayscale = () => setIsGrayscale(!isGrayscale);
  const resetAll = () => {
    setFontSize(100);
    setIsGrayscale(false);
  };

  return (
    <div className="accessibility-widget">
      {/* Botón flotante (el ojito) */}
      <button
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Eye />
      </button>

      {/* Panel de opciones */}
      {isOpen && (
        <div className="accessibility-panel">
          <h4>Accesibilidad</h4>
          <button onClick={increaseFont}>
            <Plus size={18} /> Aumentar texto
          </button>
          <button onClick={decreaseFont}>
            <Minus size={18} /> Reducir texto
          </button>
          <button onClick={toggleGrayscale}>
             {isGrayscale ? "Desactivar grises" : "Escala de grises"}
          </button>
          <button onClick={resetAll}>
            <RefreshCcw size={18} /> Restablecer
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;
