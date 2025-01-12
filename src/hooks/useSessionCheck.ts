import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useSessionCheck = () => {
  const navigate = useNavigate();

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // If there's no session, don't do anything (let component handle it)
    if (!session || error) return;

    // Check if first time user
    const { data: sources } = await supabase
      .from("payment_sources")
      .select("id")
      .eq("user_id", session.user.id)
      .limit(1);

    const isFirstTimeUser = !sources || sources.length === 0;
    
    if (isFirstTimeUser) {
      localStorage.setItem("isFirstTimeUser", "true");
      navigate("/app/payment-source");
    } else {
      localStorage.removeItem("isFirstTimeUser");
      navigate("/app");
    }
  };

  return { checkSession };
};