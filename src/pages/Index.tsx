
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_ROUTE } from '../routes';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      navigate(DASHBOARD_ROUTE);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold mb-4 text-foreground dark:text-dark-foreground">
          Swathi Reddy Girls Hostel
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading management dashboard...</p>
        <div className="flex flex-col items-center space-y-2 mt-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </div>
    </div>
  );
};

export default Index;
