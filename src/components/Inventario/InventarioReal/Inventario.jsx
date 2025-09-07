import React, { useState, useEffect } from "react";
import { useAuthenticatedRequest } from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import InventoryDashboard from "./InventoryDashboard";
import InventoryTable from "./InventoryTable";
import "./Inventario.css";

const Inventario = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { makeRequest } = useAuthenticatedRequest();
  const PRODUCTS_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app/products';

  // Fetch products from the database when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await makeRequest(PRODUCTS_URL, { method: 'GET' });
      
      // Transform data to include stock_minimo if not present
      const processedData = data.map(product => ({
        ...product,
        stock: product.stock || 0,
      }));
      
      setProducts(processedData || []);
      
      // Set the first product as selected by default if available
      if (processedData.length > 0 && !selectedProduct) {
        setSelectedProduct(processedData[0]);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      Swal.fire('Error', 'No se pudieron cargar los productos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-module">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      )}
      
      {/* Dashboard arriba */}
      <InventoryDashboard products={products} selectedProduct={selectedProduct} />

      {/* Tabla abajo */}
      <InventoryTable products={products} onSelect={setSelectedProduct} />
    </div>
  );
};

export default Inventario;
