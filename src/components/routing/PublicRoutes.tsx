import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { ResetPassword } from "@/pages/ResetPassword";
import { ResetPasswordSuccess } from "@/pages/ResetPasswordSuccess";
import { EmailConfirmationSuccess } from "@/pages/EmailConfirmationSuccess";
import { Onboarding } from "@/pages/Onboarding";
import { Terms } from "@/pages/Terms";

export const PublicRoutes = () => {
  const { user } = useAuth();
  const isFirstTimeUser = localStorage.getItem("isFirstTimeUser") === "true";
  const isEmailVerified = user?.email_confirmed_at != null;

  // Allow access to email confirmation success page regardless of auth state
  if (window.location.pathname === "/email-confirmation-success") {
    return (
      <Routes>
        <Route path="/email-confirmation-success" element={<EmailConfirmationSuccess />} />
      </Routes>
    );
  }

  // Handle authenticated user routes
  if (user) {
    if (!isEmailVerified) {
      return <Navigate to="/signup" />;
    }

    if (isFirstTimeUser) {
      return <Navigate to="/app/payment-source" />;
    }

    return <Navigate to="/app" />;
  }

  // Public routes for non-authenticated users
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
      <Route path="/email-confirmation-success" element={<EmailConfirmationSuccess />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};