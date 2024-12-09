import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import { PaymentSource } from "@/pages/PaymentSource";

export const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/payment-source" element={<PaymentSource />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};