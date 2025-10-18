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
  
  return (
    <div className="filter-panel card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Filtros</h5>
        
        {/* Search */}
        <div className="mb-4">
          <label htmlFor="productSearch" className="form-label">Buscar por nombre</label>
          <input
            type="text"
            className="form-control"
            id="productSearch"
            placeholder="Buscar productos..."
            value={search}
            onChange={handleSearchInput}
          />
        </div>
        
        {/* Price Range */}
        <div className="mb-4">
          <h6>Rango de precio</h6>
          <div className="price-inputs d-flex">
            <div className="me-2">
              <label className="form-label">Mínimo</label>
              <input
                type="number"
                className="form-control"
                min={0}
                max={price.max}
                value={price.min}
                onChange={(e) => handlePriceChange(e, 'min')}
              />
            </div>
            <div>
              <label className="form-label">Máximo</label>
              <input
                type="number"
                className="form-control"
                min={price.min}
                value={price.max}
                onChange={(e) => handlePriceChange(e, 'max')}
              />
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-3">
          <h6>Marcas</h6>
          {categories.map(category => (
            <div className="form-check" key={category}>
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
  );
};

export default FilterPanel;
