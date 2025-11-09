import React, { useState, useEffect, useCallback } from 'react';
import FilterPanel from './FilterPanel';
import ProductCard from './ProductCard';
import api from '../../services/api';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const API_URL = '/products';

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Use centralized api client
      const response = await api.get(API_URL);
      const data = response.data;
      
      setProducts(data || []);
      
      // Extract unique categories from products
      const uniqueCategories = [...new Set(data.map(product => product.brand))];
      setCategories(uniqueCategories);
      
      // Find max price for range slider
      const maxPrice = Math.max(...data.map(product => parseFloat(product.price) || 0));
      setPriceRange(prev => ({ min: prev.min, max: Math.ceil(maxPrice) }));
      
    } catch (error) {
      console.error('Error loading products:', error);
      alert('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const applyFilters = useCallback(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price filter
    result = result.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Apply category filter
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
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="row">
              {filteredProducts.map(product => (
                <div className="col-md-4 mb-4" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No se encontraron productos con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
