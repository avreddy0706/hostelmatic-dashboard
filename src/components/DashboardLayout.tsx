import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useMobile } from "@/hooks/use-mobile";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile();
  const { isOpen } = useSidebar();
  return (
    <SidebarProvider>
      <div
        className={`min-h-screen flex w-full bg-dark-background text-dark-foreground dark:bg-dark-background ${
          isMobile ? "relative" : ""
        }`}
      >
        <DashboardSidebar />
        <main
          className={`flex-1 p-6 overflow-auto ${
            isMobile && isOpen ? "absolute w-full h-full" : ""
          }`}
        >
          <div className={`w-full max-w-7xl mx-auto`}>
            {children}
          </div>
          {isMobile && isOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-40"
              onClick={() => {
              }}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
