
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MainLayout } from "./components/Layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Unidades from "./pages/Unidades";
import Hospedes from "./pages/Hospedes";
import Estadias from "./pages/Estadias";
import Pagamentos from "./pages/Pagamentos";
import Manutencao from "./pages/Manutencao";
import Funcionarios from "./pages/Funcionarios";
import Addresses from "./pages/Addresses";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/unidades" element={
        <ProtectedRoute>
          <MainLayout>
            <Unidades />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/hospedes" element={
        <ProtectedRoute>
          <MainLayout>
            <Hospedes />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/estadias" element={
        <ProtectedRoute>
          <MainLayout>
            <Estadias />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/pagamentos" element={
        <ProtectedRoute>
          <MainLayout>
            <Pagamentos />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/manutencao" element={
        <ProtectedRoute>
          <MainLayout>
            <Manutencao />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/funcionarios" element={
        <ProtectedRoute>
          <MainLayout>
            <Funcionarios />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/addresses" element={
        <ProtectedRoute>
          <MainLayout>
            <Addresses />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
