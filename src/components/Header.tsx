import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useAuth } from "@/contexts/AuthContext";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { useEffect, useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [greeting] = useState(() => {
    const greetings = ["Hi", "Hello"];
    return greetings[Math.floor(Math.random() * greetings.length)];
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
        
      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
    : user?.email?.split('@')[0];

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

  const handleProfileClick = () => {
    navigate("/app/settings/account/edit");
  };

  return (
    <header className="flex-none bg-[#7F3DFF] pb-8">
      {/* Decorative Circle */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-8" />
      
      {/* First Row - Navigation and Actions */}
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4 relative">
        <div className="flex items-center gap-3 pl-2">
          <div 
            className="w-6 h-6 ring-2 ring-white/20 rounded-full cursor-pointer"
            onClick={handleProfileClick}
          >
            <ProfilePicture />
          </div>
          <h1 className="text-lg font-semibold text-white/90">Dashboard</h1>
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
      
      {/* Profile Info */}
      <div className="max-w-2xl mx-auto px-4 mb-2">
        <div className="flex items-center gap-4 pl-2">
          <div>
            <h2 className="text-lg font-medium text-white">
              {greeting}, {displayName}
              <span className="animate-wave ml-2">👋</span>
            </h2>
            <MotivationalQuote />
          </div>
        </div>
      </div>
    </header>
  );
};