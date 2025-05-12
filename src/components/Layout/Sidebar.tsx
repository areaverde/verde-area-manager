
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut, Menu, LayoutDashboard, Building, Users, Bed, DollarSign, Wrench, User } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Unidades", path: "/unidades", icon: <Building size={20} /> },
    { name: "Hóspedes", path: "/hospedes", icon: <Users size={20} /> },
    { name: "Estadias", path: "/estadias", icon: <Bed size={20} /> },
    { name: "Pagamentos", path: "/pagamentos", icon: <DollarSign size={20} /> },
    { name: "Manutenção", path: "/manutencao", icon: <Wrench size={20} /> },
    { name: "Funcionários", path: "/funcionarios", icon: <User size={20} /> },
  ];

  return (
    <aside
      className={cn(
        "bg-green-50 border-r border-gray-200 transition-all duration-300 ease-in-out h-screen flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        isMobile && (isCollapsed ? "-ml-16" : ""),
        className
      )}
    >
      {/* Header with logo and toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!isCollapsed && (
          <div className="font-semibold text-green-700 text-sm">
            Gestão Hospedaria<br />Area Verde
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "rounded-full hover:bg-green-100 text-green-700",
            isCollapsed ? "ml-auto mr-auto" : ""
          )}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-800",
                  isCollapsed && "justify-center px-2"
                )
              }
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            "w-full justify-start hover:bg-green-100 text-gray-700 hover:text-green-800",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
