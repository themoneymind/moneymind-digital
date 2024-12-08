import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "./contexts/FinanceContext";
import Index from "./pages/Index";
import { Onboarding } from "./pages/Onboarding";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { ForgotPassword } from "./pages/ForgotPassword";
import { PaymentSource } from "./pages/PaymentSource";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/payment-source" element={<PaymentSource />} />
          </Routes>
        </BrowserRouter>
      </FinanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;