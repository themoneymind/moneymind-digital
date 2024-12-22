import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import { PaymentSource } from "@/pages/PaymentSource";
import Settings from "@/pages/Settings";
import Report from "@/pages/Report";

export const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/app" element={<Index />} />
      <Route path="/app/payment-source" element={<PaymentSource />} />
      <Route path="/app/settings" element={<Settings />} />
      <Route path="/app/report" element={<Report />} />
      <Route path="*" element={<Navigate to="/app" />} />
    </Routes>
  );
};