import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Summer2025 = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Summer 2025 Collection</h1>
          <p className="text-lg text-gray-600 mb-8">Beat the heat with our summer collection</p>
          <div className="bg-gray-100 rounded-lg p-12">
            <p className="text-gray-500">Summer 2025 products will be displayed here</p>
            <p className="text-sm text-gray-400 mt-2">Product catalog coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summer2025;