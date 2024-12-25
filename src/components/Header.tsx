import { ArrowLeft, Bell, LogOut } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-10">
      <div className="bg-[#7F3DFF] pb-8">
        <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-16">
          <div className="flex items-center gap-4 pl-2">
            <div className="w-10 h-10 ring-2 ring-white rounded-full">
              <ProfilePicture />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                {greeting}, {displayName}
                <span className="animate-wave">👋</span>
              </h2>
              <MotivationalQuote />
            </div>
          </div>
        </div>
      </div>
      <div className="h-6 bg-[#F5F5F7] dark:bg-gray-900 relative -mt-6 rounded-t-[28px]" />
    </header>
  );
};