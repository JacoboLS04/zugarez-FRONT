import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { authService } from '../../services/authService';
import OrderCard from './OrderCard';
import Swal from 'sweetalert2';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const ORDERS_URL = '/orders';

  useEffect(() => {
    loadOrders();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, priceRange, selectedCategories, statusFilter, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      
      if (!token) {
        setError('Debes iniciar sesión para ver tus pedidos');
        return;
      }

      const data = await paymentService.getMyOrders(token);
      setOrders(data);
      
      // Extract unique categories based on your provided categories
      const availableCategories = ['Frias', 'Pa\' Picar', 'Refrescos', 'Calientes', 'Pasteleria', 'Panaderia'];
      setCategories(availableCategories);
      
      // Find max price for range slider
      const maxPrice = Math.max(...data.map(order => order.total));
      setPriceRange(prev => ({ min: prev.min, max: Math.ceil(maxPrice) }));
      
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError('No se pudieron cargar los pedidos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...orders];
    
    // Apply search filter (by customer name or product name)
    if (searchTerm) {
      result = result.filter(order => 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply price filter
    result = result.filter(order => {
      return order.total >= priceRange.min && order.total <= priceRange.max;
    });
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(order => 
        order.products.some(product => 
          selectedCategories.includes(product.category)
        )
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // Here you would make the API call to update the order status
      // await makeRequest(`${ORDERS_URL}/${orderId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      // For now, just update the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      Swal.fire('¡Actualizado!', 'El estado del pedido ha sido actualizado', 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado del pedido', 'error');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="orders-list">
      <div className="row mb-4">
        <div className="col-md-3">
          <OrdersFilterPanel 
            categories={categories}
            priceRange={priceRange}
            onSearchChange={handleSearchChange}
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
          />
        </div>
        
        <div className="col-md-9">
          {filteredOrders.length > 0 ? (
            <div className="row">
              {filteredOrders.map(order => (
                <div className="col-12 mb-4" key={order.id}>
                  <OrderCard 
                    order={order} 
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No se encontraron pedidos con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
