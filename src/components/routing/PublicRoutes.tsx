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

  // Allow access to email confirmation and reset password success pages regardless of auth state
  const currentPath = window.location.pathname;
  if (currentPath === "/email-confirmation-success" || currentPath === "/reset-password-success") {
    return (
      <Routes>
        <Route path="/email-confirmation-success" element={<EmailConfirmationSuccess />} />
        <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    );
  }

  if (user) {
    if (!isEmailVerified) {
      return <Navigate to="/signup" />;
    }

    if (isFirstTimeUser) {
      return <Navigate to="/app/payment-source" />;
    }

    return <Navigate to="/app" />;
  }

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