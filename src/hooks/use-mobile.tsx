
import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
  // Initialize with actual value instead of undefined
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
