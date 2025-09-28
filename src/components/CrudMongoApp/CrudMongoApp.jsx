import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuthenticatedRequest } from '../../hooks/useAuth';
import { useAuth } from '../../contexts/AuthContext';
import ProductList from './ProductList';
import ProductForm from './Fomulario/ProductForm';
import ProductView from './ProductView';

const CrudMongoApp = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', brand: '', supplierId: '', description: '', urlImage: '' });
  const [loading, setLoading] = useState(false);
  const { makeRequest } = useAuthenticatedRequest();
  const { user } = useAuth();

  const PRODUCTS_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app/products';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await makeRequest(PRODUCTS_URL, { method: 'GET' });
      setProducts(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      Swal.fire('Error', 'No se pudieron cargar los productos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
  console.log('🔍 DEBUG handleEdit - Producto recibido:', product);
  console.log('🔍 DEBUG handleEdit - Campos disponibles:', Object.keys(product));
  
  setSelectedProduct(product);
  setFormData({
    name: product.name || '',
    price: product.price || '',
    brand: product.brand || '',
    supplierId: product.supplierId || '',
    description: product.description || '',
    urlImage: product.urlImage || ''
  });
  setCurrentView('edit');
};

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await makeRequest(`${PRODUCTS_URL}/${productId}`, { method: 'DELETE' });
        await loadProducts();
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
        setCurrentView('list');
      } catch (error) {
        console.error('Error eliminando producto:', error);
        Swal.fire('Error', 'No se pudo eliminar el producto: ' + error.message, 'error');
      }
    }
  };

  const handleCreate = () => {
  setFormData({ 
    name: '', 
    price: '', 
    brand: '', 
    supplierId: '', 
    description: '', 
    urlImage: '' 
  });
  setCurrentView('create');
};

  const handleSubmit = async () => {
  if (!formData.name || !formData.price || !formData.brand || !formData.supplierId || !formData.urlImage) return;
    try {
      setLoading(true);
      if (currentView === 'create') {
        await makeRequest(PRODUCTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        Swal.fire('¡Éxito!', 'Producto creado correctamente', 'success');
      } else if (currentView === 'edit') {
        await makeRequest(`${PRODUCTS_URL}/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        console.log('Producto actualizado:', { ...selectedProduct, ...formData });
        Swal.fire('¡Éxito!', 'Producto actualizado correctamente', 'success');
      }
      await loadProducts();
      setCurrentView('list');
      setFormData({ name: '', price: '', urlImage: '' });
    } catch (error) {
      console.error('Error en submit:', error);
      Swal.fire('Error', 'No se pudo procesar la solicitud: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
  setCurrentView('list');
  setSelectedProduct(null);
  setFormData({ 
    name: '', 
    price: '', 
    brand: '', 
    supplierId: '', 
    description: '', 
    urlImage: '' 
  });
};

  return (
    <div className="crud-bg">
      <div className="container">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner-lg">
              <div className="spinner"></div>
              <span>Cargando...</span>
            </div>
          </div>
        )}
        {(() => {
          switch (currentView) {
            case 'create':
              return (
                <ProductForm
                  title="Crear Producto"
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  handleBack={handleBack}
                  loading={loading}
                />
              );
            case 'edit':
              return (
                <ProductForm
                  title="Editar Producto"
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  handleBack={handleBack}
                  isEdit
                  handleDelete={() => handleDelete(selectedProduct.id)}
                  loading={loading}
                />
              );
            default:
              return (
                <ProductList
                  products={products}
                  handleEdit={handleEdit}
                  handleCreate={handleCreate}
                  loading={loading}
                />
              );
          }
        })()}
      </div>
    </div>
  );
};

export default CrudMongoApp;
