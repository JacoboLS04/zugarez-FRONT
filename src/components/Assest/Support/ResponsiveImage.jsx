import React from 'react';
import './ResponsiveImage.css';

const ResponsiveImage = ({ imagePath, altText, size = 'medium' }) => {
  const imageSrc = typeof imagePath === 'object' ? imagePath.default : imagePath;

  return (
    <div className={`responsive-image ${size}`}>
      <img
        src={imageSrc} // Usar la ruta correcta de la imagen
        alt={altText}
        loading="lazy"
      />
    </div>
  );
};

export default ResponsiveImage;