
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

// Create a separate component for the dashboard content so we can use the useSidebar hook
function DashboardContent() {
  const isMobile = useIsMobile();
  const { setOpen } = useSidebar();
  
  return (
    <div className="min-h-screen flex w-full bg-dark-background text-dark-foreground dark:bg-dark-background">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {isMobile && (
          <button 
            onClick={() => setOpen(true)}
            className="fixed top-4 left-4 z-30 p-2 bg-primary rounded-md shadow-md flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <Menu size={24} color="white" />
          </button>
        )}
        <div className="w-full max-w-7xl mx-auto mt-12 md:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function DashboardLayout() {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <DashboardContent />
    </SidebarProvider>
  );
}
