import { ArrowLeft, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfilePicture } from "./ProfilePicture";
import { Greeting } from "./Greeting";

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
    <div className="bg-gradient-to-b from-purple-600 to-purple-500 text-white pb-12">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-200" />
          </button>
        </div>
      </header>
      <div className="px-6 flex items-center justify-between">
        <div>
          <Greeting />
          <p className="text-white/80 text-sm mt-1">Save for tomorrow</p>
        </div>
        <ProfilePicture />
      </div>
    </div>
  );
};