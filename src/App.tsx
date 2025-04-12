
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { DASHBOARD_ROUTE, ROUTES } from "./routes";
import { Suspense, lazy } from 'react';
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>  
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={DASHBOARD_ROUTE} replace />} />
            <Route element={<DashboardLayout />}>
              {ROUTES.filter(route => route.path !== '/').map((route) => (
                <Route 
                  key={route.path} 
                  path={route.path} 
                  element={
                    <Suspense fallback={<div className="p-6 flex justify-center">Loading...</div>}>
                      {route.element}
                    </Suspense>
                  } 
                />
              ))}
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
