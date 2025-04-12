
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { ROUTES } from "./routes";
import { Suspense } from 'react';
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
      <ErrorBoundary>  
        <BrowserRouter>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>


                {ROUTES.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Routes>
            </Suspense>
          </DashboardLayout>
        </BrowserRouter>

      </ErrorBoundary>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
