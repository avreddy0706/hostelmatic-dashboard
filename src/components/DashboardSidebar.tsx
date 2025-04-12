
import {
  Home,
  Users,
  Building2,
  CreditCard,
  BarChart2,
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

  // For desktop view - we use the sidebar component directly
  if (!isMobile) {
    return (
      <Sidebar className="dark:bg-dark-secondary shadow-lg">
        <SidebarContent>
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary truncate">
              Swathi Reddy Girls Hostel
            </h1>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.path)}
                      className={`w-full bg-dark-secondary hover:bg-primary ${location.pathname === item.path ? 'bg-primary text-white' : ''}`}
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
    );
  }

  // For mobile view - use a custom drawer-like menu
  const overlayStyle: CSSProperties = open
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

  const sidebarStyle: CSSProperties = {
    position: "fixed",
    left: open ? "0" : "-100%",
    top: "0",
    height: "100%",
    zIndex: 50,
    transition: "left 0.3s ease-in-out",
    width: "85%",
    maxWidth: "300px",
    backgroundColor: "var(--dark-secondary)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  };

  return (
    <>
      {open && (
        <div 
          style={overlayStyle} 
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div style={sidebarStyle}>
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary truncate">
            Swathi Reddy Girls Hostel
          </h1>
          <button
            className="p-2 rounded-full hover:bg-dark-background"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X 
              className="text-dark-foreground"
              size={24}
              strokeWidth={1.5}
            />
          </button>
        </div>
        <div className="px-4 py-2">
          <div className="text-sm text-dark-foreground opacity-70 mb-2">Management</div>
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                      location.pathname === item.path 
                        ? 'bg-primary text-white' 
                        : 'bg-dark-secondary text-dark-foreground hover:bg-primary hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-base">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
