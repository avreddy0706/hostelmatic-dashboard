
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
        zIndex: 50,
        transition: "left 0.3s ease-in-out",
      }
    : {};

  return (
    <Sidebar style={sidebarStyle} className="dark:bg-dark-secondary">
      <SidebarContent>
        {isMobile && (
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-dark-foreground">
              Swathi Reddy Girls Hostel
            </h1>
            {open ? (
              <X 
                className="cursor-pointer text-dark-foreground"
                size={32}
                strokeWidth={1.5}
                onClick={() => setOpen(false)}
              />
            ) : (
              <Menu
                className="cursor-pointer text-dark-foreground"
                size={32}
                strokeWidth={1.5}
                onClick={() => setOpen(true)}
              />
            )}
          </div>
        )}
        {!isMobile && (
          <div className="p-4">
            <h1 className="text-xl font-bold text-primary">
              Swathi Reddy Girls Hostel 
            </h1>
          </div>
        )}
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
                    <item.icon className="w-4 h-4 mr-2 text-dark-foreground" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
