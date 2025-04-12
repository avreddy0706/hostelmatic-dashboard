
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { open, setOpen } = useSidebar();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dark-background text-dark-foreground dark:bg-dark-background">
        <DashboardSidebar />
        <main
          className={`flex-1 p-6 overflow-auto ${
            isMobile && open ? "absolute w-full h-full" : ""
          }`}
        >
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
          {isMobile && open && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-40"
              onClick={() => setOpen(false)}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
