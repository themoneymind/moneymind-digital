import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Onboarding } from "@/pages/Onboarding";
import { Terms } from "@/pages/Terms";
import { PaymentSource } from "@/pages/PaymentSource";

export const PublicRoutes = () => {
  const { user } = useAuth();
  const isFirstTimeUser = localStorage.getItem("isFirstTimeUser") === "true";
  const isEmailVerified = user?.email_confirmed_at != null;

  if (user) {
    // If email is not verified, stay on the current page
    if (!isEmailVerified) {
      return (
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>
      );
    }

    // If first time user, go to payment source
    if (isFirstTimeUser) {
      return <Navigate to="/app/payment-source" />;
    }

    // Otherwise, go to dashboard
    return <Navigate to="/app" />;
  }

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};
