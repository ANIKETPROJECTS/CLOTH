// Simple navigation utility for handling page routing
export const navigateToPage = (pageName: string) => {
  // Create a simple hash-based routing system
  const page = pageName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  window.location.hash = `#/${page}`;
  
  // Trigger a custom event to handle navigation
  window.dispatchEvent(new CustomEvent('navigate', { detail: { page } }));
};

export const getPageFromHash = (): string => {
  const hash = window.location.hash.slice(2); // Remove '#/'
  if (hash.startsWith('product/')) {
    return 'product';
  }
  return hash || 'home';
};