import {
  Home,
  Users,
  Building2,
  CreditCard,
  BarChart2,
  Menu,
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
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/" },
  { title: "Tenants", icon: Users, path: "/tenants" },
  { title: "Rooms", icon: Building2, path: "/rooms" },
  { title: "Payments", icon: CreditCard, path: "/payments" },
  { title: "Analytics", icon: BarChart2, path: "/analytics" },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarStyle = isMobile
    ? {
        position: "fixed",
        left: isOpen ? "0" : "-100%",
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
            <Menu
              className="cursor-pointer text-dark-foreground"
              size={32}
              strokeWidth={1.5}
              fill="transparent"
              
              onClick={() => setIsOpen(!isOpen)}
            />
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
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="bg-dark-secondary hover:bg-primary"
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
