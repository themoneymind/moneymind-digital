import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FinanceProvider } from "./contexts/FinanceContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import { Onboarding } from "./pages/Onboarding";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { ForgotPassword } from "./pages/ForgotPassword";
import { PaymentSource } from "./pages/PaymentSource";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      if (!session?.user) return;

      const { data: sources } = await supabase
        .from("payment_sources")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      const isFirstTimeUser = !sources || sources.length === 0;
      localStorage.setItem("isFirstTimeUser", isFirstTimeUser.toString());
    };

    checkFirstTimeUser();
  }, [session]);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const isFirstTimeUser = localStorage.getItem("isFirstTimeUser") === "true";

  if (isFirstTimeUser && window.location.pathname !== "/payment-source") {
    return <Navigate to="/payment-source" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { session } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          session ? 
            <Navigate to="/dashboard" replace /> : 
            <Onboarding />
        } 
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-source"
        element={
          <ProtectedRoute>
            <PaymentSource />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <FinanceProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </FinanceProvider>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;