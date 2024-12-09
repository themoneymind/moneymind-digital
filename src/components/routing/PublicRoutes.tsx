import { Route } from "react-router-dom";
import { Onboarding } from "@/pages/Onboarding";
import { SignUp } from "@/pages/SignUp";
import { SignIn } from "@/pages/SignIn";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PublicRoutes = () => {
  const { session } = useAuth();
  
  return (
    <>
      <Route 
        path="/" 
        element={
          session ? 
            <Navigate to="/dashboard" replace /> : 
            <Onboarding />
        } 
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </>
  );
};