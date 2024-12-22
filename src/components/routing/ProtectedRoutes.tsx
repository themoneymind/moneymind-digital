import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import { PaymentSource } from "@/pages/PaymentSource";
import Settings from "@/pages/Settings";
import Report from "@/pages/Report";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const ProtectedRoutes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Session expired",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/signin');
      }
    };

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    // Initial check
    checkSession();

    return () => clearInterval(interval);
  }, [navigate, toast]);

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/app" element={<Index />} />
      <Route path="/app/payment-source" element={<PaymentSource />} />
      <Route path="/app/settings" element={<Settings />} />
      <Route path="/app/report" element={<Report />} />
      <Route path="*" element={<Navigate to="/app" />} />
    </Routes>
  );
};