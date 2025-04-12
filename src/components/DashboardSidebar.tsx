
import {
  Home,
  Users,
  Building2,
  CreditCard,
  BarChart2,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { DASHBOARD_ROUTE, TENANTS_ROUTE, ROOMS_ROUTE, PAYMENTS_ROUTE, ANALYTICS_ROUTE } from "@/routes";
import { CSSProperties } from "react";

const menuItems = [
  { title: "Dashboard", icon: Home, path: DASHBOARD_ROUTE },
  { title: "Tenants", icon: Users, path: TENANTS_ROUTE },
  { title: "Rooms", icon: Building2, path: ROOMS_ROUTE },
  { title: "Payments", icon: CreditCard, path: PAYMENTS_ROUTE },
  { title: "Analytics", icon: BarChart2, path: ANALYTICS_ROUTE },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { open, setOpen } = useSidebar();

  const sidebarStyle: CSSProperties = isMobile
    ? {
        position: "fixed",
        left: open ? "0" : "-100%",
        top: "0",
        height: "100%",
        zIndex: 50,
        transition: "left 0.3s ease-in-out",
        width: "85%", // Make mobile sidebar wider
        maxWidth: "300px"
      }
    : {};

  const overlayStyle: CSSProperties = isMobile && open
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 40
      }
    : {};

  return (
    <>
      {isMobile && open && (
        <div 
          style={overlayStyle} 
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar style={sidebarStyle} className="dark:bg-dark-secondary shadow-lg">
        <SidebarContent>
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary truncate">
              Swathi Reddy Girls Hostel
            </h1>
            {isMobile && (
              <X 
                className="cursor-pointer text-dark-foreground ml-2 flex-shrink-0"
                size={24}
                strokeWidth={1.5}
                onClick={() => setOpen(false)}
              />
            )}
          </div>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setOpen(false);
                      }}
                      className={`bg-dark-secondary hover:bg-primary ${location.pathname === item.path ? 'bg-primary text-white' : ''}`}
                    >
                      <item.icon className="w-5 h-5 mr-3 text-dark-foreground" />
                      <span className="text-base">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
