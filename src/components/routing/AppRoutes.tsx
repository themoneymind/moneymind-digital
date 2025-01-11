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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      const currentPath = window.location.pathname;
      
      // Don't redirect if on success pages
      if (currentPath === '/email-confirmation-success' || currentPath === '/reset-password-success') {
        return;
      }

      // Only redirect on sign out
      if (event === 'SIGNED_OUT') {
        navigate('/signin');
        return;
      }

      // Handle email confirmation specifically
      if (event === 'USER_UPDATED' && session?.user?.email_confirmed_at) {
        // Sign out the user to prevent automatic redirect to /app
        await supabase.auth.signOut();
        navigate('/email-confirmation-success', { replace: true });
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