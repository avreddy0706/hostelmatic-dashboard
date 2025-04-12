
import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
  // Initialize with server-friendly default
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Update the state with the actual value once we're in the browser
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
