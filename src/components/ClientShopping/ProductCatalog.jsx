import React, { useState, useEffect, useCallback } from 'react';
import { useAuthenticatedRequest } from '../../hooks/useAuth';
import FilterPanel from './FilterPanel';
import ProductCard from './ProductCard';
import Swal from 'sweetalert2';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { makeRequest } = useAuthenticatedRequest();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const PRODUCTS_URL = '/products';

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await makeRequest(PRODUCTS_URL, { method: 'GET' });
      setProducts(data || []);
      const uniqueCategories = [...new Set(data.map(product => product.brand))];
      setCategories(uniqueCategories);
      const maxPrice = Math.max(...data.map(product => parseFloat(product.price) || 0));
      setPriceRange(prev => ({ min: prev.min, max: Math.ceil(maxPrice) }));
    } catch (error) {
      console.error('Error loading products:', error);
      Swal.fire('Error', 'No se pudieron cargar los productos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [makeRequest, PRODUCTS_URL]);

  // Apply filters whenever filter states change
  const applyFilters = useCallback(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result = result.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.brand)
      );
    }
    setFilteredProducts(result);
  }, [products, searchTerm, priceRange, selectedCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  return (
    <div className="product-catalog">
      <div className="row mb-4">
        <div className="col-md-3">
          <FilterPanel 
            categories={categories}
            priceRange={priceRange}
            onSearchChange={handleSearchChange}
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        
        <div className="col-md-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando productos...</span>
              </div>
              <p className="mt-3 text-muted">Cargando productos...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="row">
              {filteredProducts.map(product => (
                <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron productos con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
