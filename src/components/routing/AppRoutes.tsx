import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import Index from "@/pages/Index";
import { PaymentSource } from "@/pages/PaymentSource";

export const AppRoutes = () => {
  return (
    <Routes>
      {PublicRoutes()}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Index />} />
        <Route path="/payment-source" element={<PaymentSource />} />
      </Route>
    </Routes>
  );
};