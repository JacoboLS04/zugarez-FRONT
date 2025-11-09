import React, { useEffect, useCallback, useState, useRef } from "react";

export default function ImageCarousel({
  images = [],
  autoPlay = true,
  interval = 4500,
}) {
  const [idx, setIdx] = useState(0);
  const count = images.length;
  const timer = useRef(null);

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % (count || 1));
  }, [count]);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + (count || 1)) % (count || 1));
  }, [count]);

  const goTo = useCallback((i) => {
    setIdx(i);
  }, [count]);

  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    timer.current = setInterval(next, interval);
    return () => clearInterval(timer.current);
  }, [next, count, autoPlay, interval]);

  // Fallback si no hay imágenes
  if (count === 0) {
    return (
      <div className="carousel" role="region" aria-label="Carrusel con imágenes">
        <div className="carousel__frame carousel__placeholder">
          <span>Carrusel con imágenes</span>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel" role="region" aria-label="Carrusel con imágenes" id="inicio">
      <div className="carousel__frame">
        <div
          className="carousel__track"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {images.map((src, i) => (
            <div className="carousel__slide" key={i} aria-hidden={i !== idx}>
              <img src={src} alt={`Imagen ${i + 1} del carrusel`} />
            </div>
          ))}
        </div>
      </div>

      <button className="carousel__btn carousel__btn--prev" onClick={prev} aria-label="Imagen anterior">‹</button>
      <button className="carousel__btn carousel__btn--next" onClick={next} aria-label="Imagen siguiente">›</button>

      <div className="carousel__dots" role="tablist" aria-label="Indicadores de carrusel">
        {images.map((_, i) => (
          <button
            key={i}
            className={`carousel__dot ${i === idx ? "is-active" : ""}`}
            aria-pressed={i === idx}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
