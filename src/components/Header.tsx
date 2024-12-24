import { ArrowLeft, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      localStorage.removeItem("isFirstTimeUser");
      navigate("/signin");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-10">
      <div className="bg-[#7F3DFF] pb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-6 bg-[#F5F5F7] dark:bg-gray-900 relative -mt-6 rounded-t-[28px]" />
    </header>
  );
};