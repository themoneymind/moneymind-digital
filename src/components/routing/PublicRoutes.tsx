import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Onboarding } from "@/pages/Onboarding";
import { Terms } from "@/pages/Terms";

export const PublicRoutes = () => {
  const { user } = useAuth();
  const isFirstTimeUser = localStorage.getItem("isFirstTimeUser") === "true";

  if (user) {
    if (isFirstTimeUser) {
      return <Navigate to="/onboarding" />;
    }
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