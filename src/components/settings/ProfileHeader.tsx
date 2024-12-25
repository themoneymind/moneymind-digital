import { useAuth } from "@/contexts/AuthContext";
import { Edit } from "lucide-react";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ProfileHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-apple p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative rounded-full overflow-hidden">
            <ProfilePicture />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
              {displayName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/app/settings/account/edit')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Edit profile"
        >
          <Edit className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};