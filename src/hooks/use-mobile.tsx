
import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
  // Initialize with null state (server-side friendly)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if device is mobile
    const checkIsMobile = () => {
      return window.innerWidth < 768; // md breakpoint
    };
    
    // Set initial value
    setIsMobile(checkIsMobile());
    
    // Update on resize
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
