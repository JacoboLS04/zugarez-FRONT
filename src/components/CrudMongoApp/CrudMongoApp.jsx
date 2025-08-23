import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuthenticatedRequest } from '../../hooks/useAuth';
import { useAuth } from '../../contexts/AuthContext';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import ProductView from './ProductView';

const CrudMongoApp = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(false);
  
  const { makeRequest } = useAuthenticatedRequest();
  const { user } = useAuth();

  // URL base para los productos (ajusta según tu backend)
  const PRODUCTS_URL = 'http://localhost:8080/products';

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Cargando productos desde:', PRODUCTS_URL);
      const data = await makeRequest(PRODUCTS_URL, {
        method: 'GET'
      });
      console.log('Productos cargados:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      Swal.fire('Error', 'No se pudieron cargar los productos: ' + error.message, 'error');
      // Si no hay endpoint de productos, usar datos de ejemplo
      setProducts([
        { id: 1, name: 'Producto Ejemplo 1', price: '100' },
        { id: 2, name: 'Producto Ejemplo 2', price: '200' },
        { id: 3, name: 'Producto Ejemplo 3', price: '300' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setCurrentView('view');
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({ name: product.name, price: product.price });
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
        console.log('Eliminando producto:', productId);
        // Intentar eliminar del backend
        await makeRequest(`${PRODUCTS_URL}/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Recargar productos después de eliminar
        await loadProducts();
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      } catch (error) {
        console.error('Error eliminando producto:', error);
        Swal.fire('Error', 'No se pudo eliminar el producto: ' + error.message, 'error');
      }
    }
  };

  const handleCreate = () => {
    setFormData({ name: '', price: '' });
    setCurrentView('create');
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) return;
    
    try {
      setLoading(true);
      
      if (currentView === 'create') {
        try {
          console.log('Creando producto:', formData);
          // Intentar crear en el backend
          const response = await makeRequest(PRODUCTS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: formData.name,
              price: formData.price
            })
          });
          console.log('Respuesta del backend:', response);
          
          // Recargar productos después de crear
          await loadProducts();
          Swal.fire('¡Éxito!', 'Producto creado correctamente', 'success');
        } catch (error) {
          console.error('Error creando producto:', error);
          Swal.fire('Error', 'No se pudo crear el producto: ' + error.message, 'error');
          return; // No continuar si hay error
        }
      } else if (currentView === 'edit') {
        try {
          console.log('Actualizando producto:', selectedProduct.id, formData);
          // Intentar actualizar en el backend
          const response = await makeRequest(`${PRODUCTS_URL}/${selectedProduct.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: formData.name,
              price: formData.price
            })
          });
          console.log('Producto actualizado:', response);
          
          // Recargar productos después de actualizar
          await loadProducts();
          Swal.fire('¡Éxito!', 'Producto actualizado correctamente', 'success');
        } catch (error) {
          console.error('Error actualizando producto:', error);
          Swal.fire('Error', 'No se pudo actualizar el producto: ' + error.message, 'error');
          return; // No continuar si hay error
        }
      }
      
      setCurrentView('list');
      setFormData({ name: '', price: '' });
      
    } catch (error) {
      console.error('Error en submit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedProduct(null);
    setFormData({ name: '', price: '' });
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
        
        {/* Renderizado condicional */}
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
                  loading={loading}
                />
              );
            case 'view':
              return <ProductView product={selectedProduct} handleBack={handleBack} />;
            default:
              return (
                <ProductList 
                  products={products} 
                  handleView={handleView} 
                  handleEdit={handleEdit} 
                  handleDelete={handleDelete} 
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
