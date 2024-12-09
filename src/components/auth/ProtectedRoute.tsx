import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      if (!session?.user) return;

      const { data: sources } = await supabase
        .from("payment_sources")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      const isFirstTimeUser = !sources || sources.length === 0;
      localStorage.setItem("isFirstTimeUser", isFirstTimeUser.toString());
    };

    checkFirstTimeUser();
  }, [session]);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const isFirstTimeUser = localStorage.getItem("isFirstTimeUser") === "true";

  if (isFirstTimeUser && window.location.pathname !== "/payment-source") {
    return <Navigate to="/payment-source" replace />;
  }

  return children;
};