import React from 'react';

const ProductForm = ({ title, formData, setFormData, handleSubmit, handleBack, isEdit }) => (
  <div className="crud-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="card" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)', padding: '32px 24px' }}>
        <div className="card-header" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>{title}</div>
        <div className="card-body" style={{ background: '#fff', color: '#212529', borderRadius: '8px', padding: '24px' }}>
          <form onSubmit={e => {e.preventDefault(); handleSubmit();}}>
            <div style={{ marginBottom: '18px', textAlign: 'left' }}>
              <input
                type="text"
                placeholder="Nombre del producto"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1.1rem', marginBottom: '8px' }}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '18px', textAlign: 'left' }}>
              <input
                type="text"
                placeholder="Precio del producto"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1.1rem', marginBottom: '8px' }}
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'center' }}>
              <button type="submit" className="btn btn-add" style={{ fontSize: '1.1rem', padding: '10px 24px', borderRadius: '6px' }}>
                {isEdit ? '💾 Guardar cambios' : '➕ Agregar'}
              </button>
              <button type="button" className="btn btn-delete" style={{ fontSize: '1.1rem', padding: '10px 24px', borderRadius: '6px' }} onClick={handleBack}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export default ProductForm;
