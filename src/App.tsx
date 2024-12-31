import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "./App.css";

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <FinanceProvider>
            <TooltipProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </FinanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;