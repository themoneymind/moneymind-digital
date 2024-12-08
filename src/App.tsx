import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FinanceProvider } from "./contexts/FinanceContext";
import Index from "./pages/Index";
import { Onboarding } from "./pages/Onboarding";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { ForgotPassword } from "./pages/ForgotPassword";
import { PaymentSource } from "./pages/PaymentSource";

const queryClient = new QueryClient();

// Simple auth check - in a real app, this would check JWT tokens, etc.
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

const hasPaymentSources = () => {
  const sources = localStorage.getItem("paymentSources");
  return sources && JSON.parse(sources).length > 0;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but no payment sources, redirect to payment source page
  if (!hasPaymentSources() && window.location.pathname !== "/payment-source") {
    return <Navigate to="/payment-source" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={
                isAuthenticated() ? 
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
        </BrowserRouter>
      </FinanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;