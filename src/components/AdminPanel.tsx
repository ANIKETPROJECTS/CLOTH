import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { isAuthenticated } = useAuth();

  const handleBackToWebsite = () => {
    // Navigate instantly to home
    window.location.hash = '#/';
    // Force immediate navigation without waiting for events
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToWebsite}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Website</span>
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated ? (
          <AdminDashboard onClose={handleBackToWebsite} />
        ) : (
          <div className="max-w-md mx-auto">
            <AdminLogin />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;