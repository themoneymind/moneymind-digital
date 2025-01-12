import { Routes as RouterRoutes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Routes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      console.log("Session:", session);
      console.log("User email confirmed at:", session?.user?.email_confirmed_at);
      
      // Handle email confirmation specifically
      if (event === 'USER_UPDATED' && session?.user?.email_confirmed_at) {
        console.log("Email confirmed, redirecting to success page");
        navigate('/email-confirmation-success');
        return;
      }
      
      // Only redirect on sign out
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to signin");
        navigate('/signin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <RouterRoutes>
      <Route path="/*" element={user ? <ProtectedRoutes /> : <PublicRoutes />} />
    </RouterRoutes>
  );
};