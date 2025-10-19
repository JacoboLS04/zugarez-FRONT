import React, { useState, useEffect } from 'react';
import { useAuthenticatedRequest } from '../../hooks/useAuth';
import OrdersFilterPanel from './OrdersFilterPanel';
import OrderCard from './OrderCard';
import Swal from 'sweetalert2';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { makeRequest } = useAuthenticatedRequest();
  
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
      
      // Mock data with Colombian products and categories
      const mockOrders = [
        {
          id: 1,
          customerName: 'Juan Pérez',
          products: [
            { name: 'Coca-Cola 500 ml', category: 'Refrescos', price: 3500, quantity: 2 },
            { name: 'Empanada de carne', category: 'Frias', price: 2500, quantity: 3 }
          ],
          total: 14500,
          status: 'Pendiente',
          date: '2024-01-15',
          time: '14:30'
        },
        {
          id: 2,
          customerName: 'María García',
          products: [
            { name: 'Croissaint frances', category: 'Panaderia', price: 4200, quantity: 2 },
            { name: 'Cafe late', category: 'Calientes', price: 5500, quantity: 1 }
          ],
          total: 13900,
          status: 'Completado',
          date: '2024-01-14',
          time: '09:15'
        },
        {
          id: 3,
          customerName: 'Carlos López',
          products: [
            { name: 'Pastel de chocolate', category: 'Pasteleria', price: 8500, quantity: 1 },
            { name: 'Capuchino', category: 'Calientes', price: 6200, quantity: 2 }
          ],
          total: 20900,
          status: 'En Proceso',
          date: '2024-01-16',
          time: '16:45'
        },
        {
          id: 4,
          customerName: 'Ana Rodríguez',
          products: [
            { name: 'CheesCake', category: 'Pasteleria', price: 12000, quantity: 1 },
            { name: 'Granizado de cafe', category: 'Refrescos', price: 4800, quantity: 1 },
            { name: 'Malteada', category: 'Refrescos', price: 7500, quantity: 1 }
          ],
          total: 24300,
          status: 'Pendiente',
          date: '2024-01-17',
          time: '11:20'
        },
        {
          id: 5,
          customerName: 'Luis Martínez',
          products: [
            { name: 'Empanada de carne', category: 'Frias', price: 2500, quantity: 4 },
            { name: 'Coca-Cola 500 ml', category: 'Refrescos', price: 3500, quantity: 2 }
          ],
          total: 17000,
          status: 'Completado',
          date: '2024-01-15',
          time: '13:10'
        }
      ];

      setOrders(mockOrders);
      
      // Extract unique categories based on your provided categories
      const availableCategories = ['Frias', 'Pa\' Picar', 'Refrescos', 'Calientes', 'Pasteleria', 'Panaderia'];
      setCategories(availableCategories);
      
      // Find max price for range slider
      const maxPrice = Math.max(...mockOrders.map(order => order.total));
      setPriceRange(prev => ({ min: prev.min, max: Math.ceil(maxPrice) }));
      
    } catch (error) {
      console.error('Error loading orders:', error);
      Swal.fire('Error', 'No se pudieron cargar los pedidos: ' + error.message, 'error');
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
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : filteredOrders.length > 0 ? (
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
