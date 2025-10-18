import React, { useState, useEffect } from 'react';

const FilterPanel = ({ 
  categories, 
  priceRange, 
  onSearchChange, 
  onPriceChange, 
  onCategoryChange 
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState({ min: priceRange.min, max: priceRange.max });
  
  // Update local state when props change
  useEffect(() => {
    setPrice(priceRange);
  }, [priceRange]);
  
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };
  
  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value);
    const newPrice = { ...price, [type]: value };
    setPrice(newPrice);
    onPriceChange(newPrice);
  };
  
  const handleCategoryToggle = (category) => {
    let newSelectedCategories;
    
    if (selectedCategories.includes(category)) {
      newSelectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      newSelectedCategories = [...selectedCategories, category];
    }
    
    setSelectedCategories(newSelectedCategories);
    onCategoryChange(newSelectedCategories);
  };
  
  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPrice({ min: 0, max: priceRange.max });
    onSearchChange('');
    onCategoryChange([]);
    onPriceChange({ min: 0, max: priceRange.max });
  };
  
  return (
    <div className="filter-panel card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">
            <i className="bi bi-funnel me-2"></i>Filtros
          </h5>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={clearAllFilters}
          >
            Limpiar
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <label htmlFor="productSearch" className="form-label fw-medium">
            <i className="bi bi-search me-1"></i>Buscar producto
          </label>
          <input
            type="text"
            className="form-control"
            id="productSearch"
            placeholder="Nombre del producto..."
            value={search}
            onChange={handleSearchInput}
          />
        </div>
        
        {/* Price Range */}
        <div className="mb-4">
          <h6 className="fw-medium">
            <i className="bi bi-currency-exchange me-1"></i>Rango de precio
          </h6>
          <div className="price-inputs">
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label small">Mínimo</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min={0}
                  max={price.max}
                  value={price.min}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  placeholder="0"
                />
              </div>
              <div className="col-6">
                <label className="form-label small">Máximo</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min={price.min}
                  value={price.max}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  placeholder="100000"
                />
              </div>
            </div>
            <small className="text-muted">
              {formatCOP(price.min)} - {formatCOP(price.max)}
            </small>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-3">
          <h6 className="fw-medium">
            <i className="bi bi-tags me-1"></i>Categorías
          </h6>
          <div className="category-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {categories.map(category => (
              <div className="form-check mb-2" key={category}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <label className="form-check-label" htmlFor={`category-${category}`}>
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
