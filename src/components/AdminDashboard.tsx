import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { LogOut, Plus, Package, BarChart3, Users, Settings } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import EmailJSConfig from './EmailJSConfig';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const { products } = useProducts();
  const { getTotalItems } = useCart();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    onClose();
  };

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'T-Shirts',
      value: products.filter(p => p.category === 't-shirts').length,
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: 'Shirts',
      value: products.filter(p => p.category === 'shirts').length,
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Bottoms',
      value: products.filter(p => p.category === 'bottoms').length,
      icon: Package,
      color: 'bg-orange-500'
    },
    {
      title: 'Cart Items',
      value: getTotalItems(),
      icon: Package,
      color: 'bg-red-500'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex min-h-screen bg-white rounded-lg shadow-sm">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 rounded-l-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
          <AdminDashboard onClose={onClose} />
              <h3 className="font-bold text-gray-900">NIKZONE</h3>
              <p className="text-xs text-gray-500">Admin Panel</p>
            <AdminLogin onCancel={onClose} />
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6 w-52">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto rounded-r-lg">
        <div className="p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{product.price}</p>
                        <p className="text-xs text-gray-500">{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Manage Products</h2>
              <ProductList />
            </div>
          )}

          {activeTab === 'add-product' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Add New Product</h2>
              <ProductForm />
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Settings</h2>
              <div className="space-y-8">
                <EmailJSConfig />
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Credentials</h3>
                  <p className="text-gray-600 mb-4">Change your admin username and password</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      Credential management will be implemented with MongoDB integration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;