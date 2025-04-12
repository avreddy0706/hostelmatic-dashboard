
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-dark-background text-dark-foreground dark:bg-dark-background">
        <DashboardSidebar />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {isMobile && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="fixed top-4 left-4 z-50 p-2 bg-primary rounded-md shadow-md flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          )}
          <div className="w-full max-w-7xl mx-auto mt-12 md:mt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
