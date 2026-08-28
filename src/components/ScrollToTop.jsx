import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attempt to scroll the main scrollable container first
    const mainScrollContainer = document.getElementById('main-scroll-container');
    if (mainScrollContainer) {
      mainScrollContainer.scrollTo(0, 0);
    } else {
      // Fallback to window scroll
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
