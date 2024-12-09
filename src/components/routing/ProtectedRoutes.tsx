import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import { PaymentSource } from "@/pages/PaymentSource";

export const ProtectedRoutes = () => {
  return (
    <>
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
    </>
  );
};