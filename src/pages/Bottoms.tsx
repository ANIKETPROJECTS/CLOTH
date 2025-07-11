import React, { useState } from 'react';
import ProductFilter from '../components/ProductFilter';
import Breadcrumb from '../components/Breadcrumb';
import { ArrowLeft, X, Heart, Star } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useProductFilters } from '../hooks/useProductFilters';

const Bottoms = () => {
  const { getProductsByCategory } = useProducts();
  const allProducts = getProductsByCategory('bottoms');
  const [favorites, setFavorites] = useState<string[]>([]);


  const {
    filteredProducts,
    selectedColors,
    selectedSizes,
    selectedSleeves,
    selectedPriceRanges,
    priceRange,
    sortOption,
    hoveredProduct,
    filterOptions,
    setSortOption,
    setHoveredProduct,
    handleColorToggle,
    handleSizeToggle,
    handleSleevesToggle,
    handlePriceRangeToggle,
    handlePriceRangeChange,
    removeFilter,
    resetFilters
  } = useProductFilters({ products: allProducts });

  const handleGoBack = () => {
    window.history.back();
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleProductClick = (product: any) => {
    window.location.hash = `#/product/${product._id}`;
  };

  const breadcrumbItems = [
    { label: 'Home', onClick: () => window.location.hash = '#/' },
    { label: 'Bottoms' },
    { label: 'View All' }
  ];

  return (
    <div className="bg-white">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="text-sm text-gray-500">
                Home / <span className="text-gray-900 font-medium">Bottoms</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {allProducts.length} products
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilter
            filterOptions={filterOptions}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            selectedSleeves={selectedSleeves}
            selectedPriceRanges={selectedPriceRanges}
            priceRange={priceRange}
            onColorToggle={handleColorToggle}
            onSizeToggle={handleSizeToggle}
            onSleevesToggle={handleSleevesToggle}
            onPriceRangeToggle={handlePriceRangeToggle}
            onPriceRangeChange={handlePriceRangeChange}
            onRemoveFilter={removeFilter}
            onResetFilters={resetFilters}
            showSleeves={false}
          />
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Selected Filters */}
            {(selectedColors.length > 0 || selectedSizes.length > 0 || selectedPriceRanges.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedColors.map(color => (
                  <div key={`color-${color}`} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                    {color}
                    <button
                      onClick={() => removeFilter('color', color)}
                      className="ml-1 text-gray-500 hover:text-black"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {selectedSizes.map(size => (
                  <div key={`size-${size}`} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                    {size}
                    <button
                      onClick={() => removeFilter('size', size)}
                      className="ml-1 text-gray-500 hover:text-black"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {selectedPriceRanges.map(range => (
                  <div key={`price-${range}`} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                    {range}
                    <button
                      onClick={() => removeFilter('price', range)}
                      className="ml-1 text-gray-500 hover:text-black"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">BOTTOMS</h1>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="default">Sort by: Select...</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <p className="text-gray-500">No products match your filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    className="group relative"
                    onMouseEnter={() => setHoveredProduct(product._id!)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="aspect-[5.5/6.5] bg-gray-100 mb-2 overflow-hidden rounded-md relative">
                      {/* New Arrival Badge */}
                      {product.isNewArrival && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                            NEW ARRIVAL
                          </span>
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product._id!);
                        }}
                        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(product._id!) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </button>

                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${hoveredProduct === product._id ? 'scale-110' : 'scale-100'}`}
                      />
                    </div>
                    
                    <div className="mt-4">
                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center space-x-1 mb-2">
                          <div className="flex items-center">
                            {renderStars(product.rating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviews || 0})
                          </span>
                        </div>
                      )}
                      
                      <h3 className="font-medium text-lg group-hover:underline mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 font-bold">₹{product.price.toLocaleString()}</p>
                        {product.originalPrice && (
                          <>
                            <p className="text-gray-500 line-through text-sm">₹{product.originalPrice.toLocaleString()}</p>
                            {product.discount && (
                              <p className="text-green-600 text-sm">{product.discount}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Detail Modal */}
        </div>
      </div>
    </div>
  );
};

export default Bottoms;