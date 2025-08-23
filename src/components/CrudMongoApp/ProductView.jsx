import React from 'react';

const ProductView = ({ product, handleBack }) => (
  <div className="crud-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="card" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)', padding: '32px 24px' }}>
        <div className="card-header" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Detalles del Producto</div>
        <div className="card-body" style={{ background: '#fff', color: '#212529', borderRadius: '8px', padding: '24px' }}>
          <div style={{ marginBottom: '18px', fontSize: '1.1rem' }}><strong>ID:</strong> {product.id}</div>
          <div style={{ marginBottom: '18px', fontSize: '1.1rem' }}><strong>Nombre:</strong> {product.name}</div>
          <div style={{ marginBottom: '18px', fontSize: '1.1rem' }}><strong>Precio:</strong> {product.price}</div>
          <div className="text-end" style={{ textAlign: 'right', marginTop: '32px' }}>
            <button className="btn btn-view" style={{ fontSize: '1.1rem', padding: '10px 24px', borderRadius: '6px' }} onClick={handleBack}>🔙 Volver</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductView;
