import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Product } from '../types/Product';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';

const ProductView = () => {
  const { products } = useProducts();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('specifications');
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    // Get product ID from URL hash
    const hash = window.location.hash;
    const productId = hash.split('/product/')[1];
    
    if (productId) {
      const foundProduct = products.find(p => p._id === productId);
      setProduct(foundProduct || null);
      // Reset component state when product changes
      setSelectedImageIndex(0);
      setSelectedSize('');
      setQuantity(1);
      setIsFavorite(false);
      setActiveTab('specifications');
    }
  }, [products, window.location.hash]);

  // Listen for hash changes to update product
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const productId = hash.split('/product/')[1];
      
      if (productId) {
        const foundProduct = products.find(p => p._id === productId);
        setProduct(foundProduct || null);
        // Reset component state when product changes
        setSelectedImageIndex(0);
        setSelectedSize('');
        setQuantity(1);
        setIsFavorite(false);
        setActiveTab('specifications');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  // Use product images if available, otherwise generate some sample images
  const productImages = product.images && product.images.length > 0 
    ? [product.image, ...product.images]
    : [
        product.image,
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
        'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
        'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
      ];

  // Get similar products from the same category
  const similarProducts = products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 12);

  // All available sizes for this category
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
  
  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setAlert({
        isOpen: true,
        title: 'Size Required',
        message: 'Please select a size before adding to cart.',
        type: 'warning'
      });
      return;
    }

    addToCart(product, selectedSize, quantity);
    setAlert({
      isOpen: true,
      title: 'Added to Cart!',
      message: `${product.name} (Size: ${selectedSize}) has been added to your cart.`,
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb Header */}
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
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Home</span>
                <ChevronRight className="w-4 h-4" />
                <span className="capitalize">{product.category.replace('-', ' ')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{product.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
              {product.isNewArrival && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black text-white px-3 py-1 text-sm font-bold rounded">
                    NEW ARRIVAL
                  </span>
                </div>
              )}
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-4">SKU: {product._id}</p>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews || 0} reviews)
                  </span>
                </div>
              )}
              
              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">₹{product.originalPrice}</span>
                    {product.discount && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-lg font-medium">
                        {product.discount}
                      </span>
                    )}
                  </>
                )}
              </div>
              
              <p className="text-green-600 text-lg font-medium mb-8">Inclusive of all taxes</p>
              
              {/* Offer */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">%</span>
                  </div>
                  <div>
                    <p className="text-green-800 font-medium text-lg">Get this for ₹{Math.round(product.price * 0.85)}</p>
                    <p className="text-green-600">Buy 2 and get Rs 200 Off*</p>
                    <p className="text-green-600 text-sm">Code: B2G200</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Select Size</h3>
                <button className="text-red-500 font-medium hover:underline">
                  Size Chart
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {allSizes.map(size => {
                  const isAvailable = product.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`py-4 px-4 border rounded-lg text-center font-medium transition-all duration-200 ${
                        !isAvailable
                          ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50'
                          : selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-3 font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2 text-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>ADD TO BAG</span>
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-full border-2 py-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-lg ${
                  isFavorite
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:border-black'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'ADDED TO WISHLIST' : 'ADD TO WISHLIST'}</span>
              </button>
            </div>
            
            {/* Model Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                The model (Height 5'11") is wearing a size M
              </p>
            </div>
            
            {/* Delivery Options */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Options</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <button className="bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200">
                  CHECK
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>Please enter the PIN code to check cash/card delivery available.</p>
                <p>Return and Exchange will be available for 7 days from the date of order delivery.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">More Details</h2>
          
          <div className="border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200">
              <button
                onClick={() => setActiveTab(activeTab === 'specifications' ? '' : 'specifications')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Specifications</h3>
                  <p className="text-gray-600">Technical details and features</p>
                </div>
                <ChevronRight className={`w-6 h-6 transition-transform duration-200 ${
                  activeTab === 'specifications' ? 'rotate-90' : ''
                }`} />
              </button>
              {activeTab === 'specifications' && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Fit</h4>
                      <p className="text-gray-700">{product.specifications?.fit || 'Regular Fit'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Occasion</h4>
                      <p className="text-gray-700">{product.specifications?.occasion || 'Casual'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Sleeves</h4>
                      <p className="text-gray-700 capitalize">{product.sleeves?.replace('-', ' ') || 'Half Sleeves'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Collar</h4>
                      <p className="text-gray-700">{product.specifications?.collar || 'Round Neck'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Fabric</h4>
                      <p className="text-gray-700">{product.specifications?.fabric || '100% Cotton'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
                      <p className="text-gray-700">{product.colors.join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-b border-gray-200">
              <button
                onClick={() => setActiveTab(activeTab === 'description' ? '' : 'description')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Description</h3>
                  <p className="text-gray-600">Product overview</p>
                </div>
                <ChevronRight className={`w-6 h-6 transition-transform duration-200 ${
                  activeTab === 'description' ? 'rotate-90' : ''
                }`} />
              </button>
              {activeTab === 'description' && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 text-lg">{product.description || 'No description available.'}</p>
                </div>
              )}
            </div>
            
            <div className="border-b border-gray-200">
              <button
                onClick={() => setActiveTab(activeTab === 'return' ? '' : 'return')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Return & refund policy</h3>
                  <p className="text-gray-600">Return and refund policies</p>
                </div>
                <ChevronRight className={`w-6 h-6 transition-transform duration-200 ${
                  activeTab === 'return' ? 'rotate-90' : ''
                }`} />
              </button>
              {activeTab === 'return' && (
                <div className="px-6 pb-6">
                  <div className="space-y-3 text-gray-700">
                    <p>• Easy returns within 7 days of delivery</p>
                    <p>• Free return pickup available</p>
                    <p>• Refund will be processed within 5-7 business days</p>
                    <p>• Items should be in original condition with tags</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <button
                onClick={() => setActiveTab(activeTab === 'manufacturer' ? '' : 'manufacturer')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Manufactured By</h3>
                  <p className="text-gray-600">Company and Manufacturer Information</p>
                </div>
                <ChevronRight className={`w-6 h-6 transition-transform duration-200 ${
                  activeTab === 'manufacturer' ? 'rotate-90' : ''
                }`} />
              </button>
              {activeTab === 'manufacturer' && (
                <div className="px-6 pb-6">
                  <div className="space-y-3 text-gray-700">
                    <p><span className="font-medium">Brand:</span> {product.specifications?.brand || 'NIKZONE'}</p>
                    <p><span className="font-medium">Manufacturer:</span> {product.specifications?.manufacturer || 'Nikzone Fashion Pvt Ltd'}</p>
                    <p><span className="font-medium">Country of Origin:</span> {product.specifications?.countryOfOrigin || 'India'}</p>
                    <p><span className="font-medium">Marketed By:</span> {product.specifications?.marketedBy || 'Nikzone Fashion Pvt Ltd'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Similar Products</h2>
            <div className="border-b-2 border-red-500 w-16 mx-auto mb-12"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {similarProducts.map(similarProduct => (
                <div 
                  key={similarProduct._id} 
                  className="group cursor-pointer"
                  onClick={() => {
                    window.location.hash = `#/product/${similarProduct._id}`;
                  }}
                >
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {similarProduct.isNewArrival && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-black text-white px-2 py-1 text-xs font-bold rounded">
                          NEW ARRIVAL
                        </span>
                      </div>
                    )}
                    <button className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <img
                      src={similarProduct.image}
                      alt={similarProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                    {similarProduct.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">₹{similarProduct.price}</span>
                    {similarProduct.originalPrice && (
                      <>
                        <span className="text-xs text-gray-500 line-through">₹{similarProduct.originalPrice}</span>
                        {similarProduct.discount && (
                          <span className="text-xs text-green-600">{similarProduct.discount}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
};

export default ProductView;