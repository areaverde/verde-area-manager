
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop or when open on mobile */}
      <div className={cn("transition-all duration-300 ease-in-out", 
                         isMobile ? "absolute z-20" : "relative")}>
        {(sidebarOpen || !isMobile) && <Sidebar />}
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with menu button */}
        {isMobile && (
          <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-3"
            >
              <Menu size={24} />
            </Button>
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/476f7c09-2ade-4275-afa3-8844fb425dc4.png" 
                alt="Area Verde Suites Logo" 
                className="h-8 object-contain mr-2"
              />
              <span className="font-semibold text-green-700">Gestão Hospedaria</span>
            </div>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
