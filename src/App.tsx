import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FinanceProvider } from "./contexts/FinanceContext";
import { PublicRoutes } from "./components/routing/PublicRoutes";
import { ProtectedRoutes } from "./components/routing/ProtectedRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <FinanceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {PublicRoutes()}
              {ProtectedRoutes()}
            </Routes>
          </TooltipProvider>
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;