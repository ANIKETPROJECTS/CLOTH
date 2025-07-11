import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import HeroCarousel from './components/HeroCarousel';
import CategoryCollections from './components/CategoryCollections';
import AppPromotion from './components/AppPromotion';
import NewDealsSection from './components/NewDealsSection';
import NewArrivalsSection from './components/NewArrivalsSection';
import HappyCustomers from './components/HappyCustomers';
import StoreLocationSection from './components/StoreLocationSection';
import Footer from './components/Footer';
import TShirts from './pages/TShirts';
import Shirts from './pages/Shirts';
import Bottoms from './pages/Bottoms';
import Jackets from './pages/Jackets';
import Accessories from './pages/Accessories';
import NewArrivals from './pages/NewArrivals';
import Summer2025 from './pages/Summer2025';
import Cart from './pages/Cart';
import ProductView from './pages/ProductView';
import { getPageFromHash, navigateToPage } from './utils/navigation';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPage, setNextPage] = useState('home');

  useEffect(() => {
    const handleNavigation = () => {
      const newPage = getPageFromHash();
      if (newPage !== currentPage) {
        setIsTransitioning(true);
        setNextPage(newPage);
        
        // After fade out completes, change page and fade in
        setTimeout(() => {
          setCurrentPage(newPage);
          // Scroll to top when page changes
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
          });
          
          // Start fade in
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 150);
      }
    };

    const handleHashChange = () => {
      const newPage = getPageFromHash();
      if (newPage !== currentPage) {
        setIsTransitioning(true);
        setNextPage(newPage);
        
        // After fade out completes, change page and fade in
        setTimeout(() => {
          setCurrentPage(newPage);
          // Scroll to top when hash changes
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'auto'
            });
          }, 0);
          
          // Start fade in
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 150);
      }
    };

    // Listen for custom navigation events
    window.addEventListener('navigate', handleNavigation);
    window.addEventListener('hashchange', handleHashChange);

    // Set initial page based on current hash
    setCurrentPage(getPageFromHash());

    return () => {
      window.removeEventListener('navigate', handleNavigation);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'product':
        return <ProductView />;
      case 't-shirts':
        return <TShirts />;
      case 'shirts':
        return <Shirts />;
      case 'bottoms':
        return <Bottoms />;
      case 'jackets':
        return <Jackets />;
      case 'accessories':
        return <Accessories />;
      case 'new-arrivals':
        return <NewArrivals />;
      case 'summer-2025':
        return <Summer2025 />;
      case 'cart':
        return <Cart />;
      case 'admin':
        return <AdminPanel onClose={() => navigateToPage('home')} />;
      default:
        return (
          <div>
            <HeroCarousel />
            <CategoryCollections />
            <AppPromotion />
            <NewDealsSection />
            <NewArrivalsSection />
            <HappyCustomers />
            <StoreLocationSection />
          </div>
        );
    }
  };

  const renderPageWithTransition = () => {
    // Pages that include their own header (no separate header needed)
    const pagesWithOwnHeader = ['product', 't-shirts', 'shirts', 'bottoms', 'jackets', 'accessories', 'new-arrivals', 'summer-2025', 'cart', 'admin'];
    
    if (pagesWithOwnHeader.includes(currentPage)) {
      return (
        <div className={`transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          {renderPage()}
        </div>
      );
    }
    
    // Home page - header and footer separate from content
    return (
      <>
        <Header />
        <div className={`transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          {renderPage()}
        </div>
      </>
    );
  };
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              {renderPageWithTransition()}
            </div>
            {currentPage !== 'admin' && <Footer />}
            <ScrollToTop />
          </div>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;