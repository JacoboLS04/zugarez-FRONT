import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const renderHeader = () => (
  <nav className="navbar">
    <div className="container-fluid">
      <span className="navbar-brand mb-0 h1">
        🗄️ CRUD MongoDB
      </span>
      <span className="text-light">
        🏠 Home
      </span>
    </div>
  </nav>
);

const ProductList = ({ products, handleView, handleEdit, handleDelete, handleCreate }) => {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.roles?.includes('ROLE_ADMIN'));

  return (
    <div className="crud-bg" style={{ minHeight: '100vh', paddingTop: '32px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <nav className="navbar" style={{ marginBottom: '32px', padding: '18px 32px', fontSize: '1.3rem', fontWeight: 'bold' }}>
          <span className="navbar-brand">🗄️ CRUD MongoDB</span>
          <span className="text-light">🏠 Home</span>
        </nav>
        <div className="card" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)', padding: '24px' }}>
          <div className="card-header" style={{ fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '18px' }}>
            <span>Lista de Productos</span>
          </div>
          <div className="card-body" style={{ background: '#343a40', color: '#fff', borderRadius: '0 0 6px 6px', padding: '12px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', background: 'transparent' }}>
              <thead>
                <tr style={{ background: '#212529', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <th style={{ padding: '12px 0', borderRadius: '6px 0 0 0' }}>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Ver</th>
                  <th>Editar</th>
                  <th style={{ borderRadius: '0 6px 0 0' }}>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ background: '#343a40', color: '#fff', textAlign: 'center', borderBottom: '1px solid #444' }}>
                    <td style={{ padding: '12px 0' }}>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      <button onClick={() => handleView(product)} className="btn btn-view">👁️ Ver</button>
                    </td>
                    <td>
                      {isAdmin && (
                        <button onClick={() => handleEdit(product)} className="btn btn-edit">✏️ Editar</button>
                      )}
                    </td>
                    <td>
                      {isAdmin && (
                        <button onClick={() => handleDelete(product.id)} className="btn btn-delete">🗑️ Eliminar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isAdmin && (
          <div className="text-end" style={{ marginTop: '24px', textAlign: 'right' }}>
            <button onClick={handleCreate} className="btn btn-add" style={{ fontSize: '1.1rem', padding: '10px 24px', borderRadius: '6px' }}>➕ Agregar nuevo producto</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductList;
