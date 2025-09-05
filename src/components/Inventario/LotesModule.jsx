import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useAuthenticatedRequest } from '../../hooks/useAuth';
import { useAuth } from '../../contexts/AuthContext';
import "./LotesModule.css";
import LoteForm from "./LoteForm";

const LotesModule = () => {
  const [lotes, setLotes] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    productId: "",
    startDate: "",
    endDate: "",
    initialQuantity: "",
    availableQuantity: "",
  });
  const [formData, setFormData] = useState({
    productId: "",
    expirationDate: "",
    initialQuantity: "",
    availableQuantity: "",
    batchPrice: "",
    unitPrice: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'ascending'
  });

  const { makeRequest } = useAuthenticatedRequest();
  const { user } = useAuth();

  const LOTES_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app/inventory/lotes';
  const PRODUCTS_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app/products';

  useEffect(() => {
    loadLotes();
    loadProducts();
  }, []);

  const loadLotes = async () => {
    try {
      setLoading(true);
      const data = await makeRequest(LOTES_URL, { method: 'GET' });
      setLotes(data || []);
    } catch (error) {
      console.error('Error cargando lotes:', error);
      Swal.fire('Error', 'No se pudieron cargar los lotes: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await makeRequest(PRODUCTS_URL, { method: 'GET' });
      setProducts(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      productId: "",
      expirationDate: "",
      initialQuantity: "",
      availableQuantity: "",
      batchPrice: "",
      unitPrice: ""
    });
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

    // Reglas automáticas
    if (name === "initialQuantity") {
      newData.availableQuantity = value;
      if (newData.batchPrice && value > 0) {
        newData.unitPrice = (newData.batchPrice / value).toFixed(2);
      }
    }
    if (name === "batchPrice" && newData.initialQuantity > 0) {
      newData.unitPrice = (value / newData.initialQuantity).toFixed(2);
    }

    setFormData(newData);
  };

  const handleSubmit = async (formDataToSubmit) => {
    if (!formDataToSubmit.productId || !formDataToSubmit.expirationDate || 
        !formDataToSubmit.initialQuantity || !formDataToSubmit.batchPrice) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    try {
      setLoading(true);
      await makeRequest(LOTES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToSubmit)
      });
      
      Swal.fire('¡Éxito!', 'Lote creado correctamente', 'success');
      await loadLotes(); // Recargar la lista
      handleCloseModal();
    } catch (error) {
      console.error('Error creando lote:', error);
      Swal.fire('Error', 'No se pudo crear el lote: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Producto ${productId}`;
  };

  const formatDate = (dateString) => {
  // Dividir la fecha en año, mes, día
  const [year, month, day] = dateString.split('-');
  // Crear la fecha especificando todos los componentes (mes es 0-indexado en JS)
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES');
};
  // Filter handling functions
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      productId: "",
      startDate: "",
      endDate: "",
      initialQuantity: "",
      availableQuantity: "",
    });
    setSearchTerm("");
  };

  // Sort handling function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to get the sort direction indicator
  const getSortDirectionIndicator = (column) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Filter and sort lotes based on search term and filters
  const filteredLotes = lotes.filter(lote => {
    // Search term filtering (case insensitive)
    const productName = getProductName(lote.product?.id).toLowerCase();
    const initialQuantityStr = lote.initialQuantity.toString();
    
    if (searchTerm && 
        !productName.includes(searchTerm.toLowerCase()) && 
        !initialQuantityStr.includes(searchTerm)) {
      return false;
    }
    
    // Column filters
    if (filters.productId && lote.product?.id.toString() !== filters.productId) {
      return false;
    }
    
    // Date range filtering
    if ((filters.startDate || filters.endDate) && lote.expirationDate) {
      const loteDate = new Date(lote.expirationDate);
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (loteDate < startDate) return false;
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        // Add one day to include the end date in the range
        endDate.setDate(endDate.getDate() + 1);
        if (loteDate >= endDate) return false;
      }
    }
    
    if (filters.initialQuantity && lote.initialQuantity.toString() !== filters.initialQuantity) {
      return false;
    }
    
    if (filters.availableQuantity && lote.availableQuantity.toString() !== filters.availableQuantity) {
      return false;
    }
    
    return true;
  });

  // Apply sorting to the filtered lotes
  const sortedLotes = React.useMemo(() => {
    let sortableLotes = [...filteredLotes];
    if (sortConfig.key) {
      sortableLotes.sort((a, b) => {
        let aValue, bValue;
        
        // Handle different sorting keys
        switch(sortConfig.key) {
          case 'id':
            return sortConfig.direction === 'ascending' 
              ? a.id - b.id 
              : b.id - a.id;
          
          case 'product':
            aValue = getProductName(a.product?.id).toLowerCase();
            bValue = getProductName(b.product?.id).toLowerCase();
            break;
          
          case 'expirationDate':
            aValue = new Date(a.expirationDate);
            bValue = new Date(b.expirationDate);
            break;
          
          case 'initialQuantity':
            return sortConfig.direction === 'ascending' 
              ? a.initialQuantity - b.initialQuantity 
              : b.initialQuantity - a.initialQuantity;
          
          case 'availableQuantity':
            return sortConfig.direction === 'ascending' 
              ? a.availableQuantity - b.availableQuantity 
              : b.availableQuantity - a.availableQuantity;
          
          case 'batchPrice':
            return sortConfig.direction === 'ascending' 
              ? a.batchPrice - b.batchPrice 
              : b.batchPrice - a.batchPrice;
          
          case 'unitPrice':
            return sortConfig.direction === 'ascending' 
              ? a.unitPrice - b.unitPrice 
              : b.unitPrice - a.unitPrice;
          
          default:
            return 0;
        }
        
        // Generic comparison for string and date types
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLotes;
  }, [filteredLotes, sortConfig, products]);

  return (
    <div className="lotes-module">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner-lg">
            <div className="spinner"></div>
            <span>Cargando...</span>
          </div>
        </div>
      )}
      
      <h2>Gestión de Lotes</h2>
      <button className="btn-add" onClick={handleOpenModal}>➕ Agregar Lote</button>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por producto o cantidad inicial..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-item">
          <label>Fecha Vencimiento (Desde):</label>
          <input 
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-item">
          <label>Fecha Vencimiento (Hasta):</label>
          <input 
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-item">
          <label>Cantidad Inicial:</label>
          <input 
            type="number" 
            name="initialQuantity" 
            value={filters.initialQuantity} 
            onChange={handleFilterChange}
            className="filter-input"
            placeholder="Cantidad exacta"
          />
        </div>

        <div className="filter-item">
          <label>Cantidad Disponible:</label>
          <input 
            type="number" 
            name="availableQuantity" 
            value={filters.availableQuantity} 
            onChange={handleFilterChange}
            className="filter-input"
            placeholder="Cantidad exacta"
          />
        </div>

        <button className="btn-reset-filters" onClick={resetFilters}>
          Limpiar Filtros
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th className="sortable-header" onClick={() => requestSort('id')}>
              # Lote{getSortDirectionIndicator('id')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('product')}>
              Producto{getSortDirectionIndicator('product')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('expirationDate')}>
              Fecha Vencimiento{getSortDirectionIndicator('expirationDate')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('initialQuantity')}>
              Cantidad Inicial{getSortDirectionIndicator('initialQuantity')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('availableQuantity')}>
              Cantidad Disponible{getSortDirectionIndicator('availableQuantity')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('batchPrice')}>
              Precio Lote{getSortDirectionIndicator('batchPrice')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('unitPrice')}>
              Precio Unidad{getSortDirectionIndicator('unitPrice')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedLotes.length > 0 ? (
            sortedLotes.map((lote) => (
              <tr key={lote.id}>
                <td>{lote.id}</td>
                <td>{getProductName(lote.product?.id)}</td>
                <td>{formatDate(lote.expirationDate)}</td>
                <td>{lote.initialQuantity}</td>
                <td>{lote.availableQuantity}</td>
                <td>${lote.batchPrice.toFixed(2)}</td>
                <td>${lote.unitPrice.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                {lotes.length > 0 ? 'No hay resultados para la búsqueda' : 'No hay lotes registrados'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <LoteForm
          formData={formData}
          products={products}
          onChange={handleChange}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default LotesModule;