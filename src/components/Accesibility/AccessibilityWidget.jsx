import React, { useState, useEffect } from "react";
import "./AccessibilityWidget.css";
import { Eye, Contrast, Plus, Minus } from "lucide-react";

const AccessibilityWidget = () => {
  const [fontSize, setFontSize] = useState(100); // porcentaje
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [open, setOpen] = useState(false);

  // Aplica cambios de accesibilidad al body
  useEffect(() => {
    document.body.style.fontSize = `${fontSize}%`;
    document.body.classList.toggle("high-contrast", highContrast);
    document.body.classList.toggle("grayscale", grayscale);
  }, [fontSize, highContrast, grayscale]);

  return (
    <div className={`accessibility-widget ${open ? "open" : ""}`}>
      {/* Botón flotante */}
      <button 
        className="accessibility-toggle" 
        onClick={() => setOpen(!open)}
        aria-label="Opciones de accesibilidad"
      >
        <Eye />
      </button>

      {/* Panel de opciones */}
      {open && (
        <div className="accessibility-panel">
          <h4>Accesibilidad</h4>

          <div className="option">
            <span>Tamaño de fuente</span>
            <div className="buttons">
              <button onClick={() => setFontSize(fontSize - 10)} disabled={fontSize <= 80}>
                <Minus />
              </button>
              <button onClick={() => setFontSize(fontSize + 10)} disabled={fontSize >= 150}>
                <Plus />
              </button>
            </div>
          </div>

          <div className="option">
            <span>Contraste alto</span>
            <button onClick={() => setHighContrast(!highContrast)}>
              <Contrast />
            </button>
          </div>

          <div className="option">
            <span>Escala de grises</span>
            <button onClick={() => setGrayscale(!grayscale)}>
              🖤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;
