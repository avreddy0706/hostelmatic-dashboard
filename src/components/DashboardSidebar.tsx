
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
import { useState, useEffect } from 'react';

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
  
  // For mobile: Add a class to body element to prevent scrolling when sidebar is open
  useEffect(() => {
    if (isMobile) {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open, isMobile]);

  // For desktop view - use the sidebar component directly
  if (!isMobile) {
    return (
      <Sidebar className="dark:bg-dark-secondary shadow-lg z-30">
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

  // For mobile view - use the Drawer component for a sheet-like experience
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 w-64 max-w-[85%] bg-dark-secondary shadow-xl transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
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
        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <div className="text-sm text-dark-foreground opacity-70 mb-2 mt-2">Management</div>
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
      
      {/* Backdrop overlay that closes the sidebar when clicked */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
