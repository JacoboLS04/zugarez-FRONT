import React, { useEffect, useState, useCallback } from "react";

export default function ImageCarousel({
  images = [],
  autoPlay = true,
  interval = 4500,
}) {
  // índice del slide actual
  const [index, setIndex] = useState(0);
  const count = images.length;

  // avanzar al siguiente slide
  const next = useCallback(() => {
    setIndex((i) => {
      if (!count) return 0;
      return (i + 1) % count;
    });
  }, [count]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + (count || 1)) % (count || 1));
  }, [count]);

  const goTo = useCallback((i) => {
    setIndex(i);
  }, []);

  useEffect(() => {
    // auto-play
    if (!autoPlay || count === 0) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
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
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div className="carousel__slide" key={i} aria-hidden={i !== index}>
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
            className={`carousel__dot ${i === index ? "is-active" : ""}`}
            aria-pressed={i === index}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
