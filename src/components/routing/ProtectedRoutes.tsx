import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import Index from "@/pages/Index";
import { PaymentSource } from "@/pages/PaymentSource";
import Settings from "@/pages/Settings";

export const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <FinanceProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/payment-source" element={<PaymentSource />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </FinanceProvider>
  );
};