import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FinanceProvider } from "@/contexts/FinanceContext";
import Index from "@/pages/Index";
import { PaymentSource } from "@/pages/PaymentSource";

export const ProtectedRoutes = () => {
  return (
    <>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <FinanceProvider>
              <Index />
            </FinanceProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-source"
        element={
          <ProtectedRoute>
            <FinanceProvider>
              <PaymentSource />
            </FinanceProvider>
          </ProtectedRoute>
        }
      />
    </>
  );
};