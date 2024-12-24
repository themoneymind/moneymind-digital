import { useAuth } from "@/contexts/AuthContext";
import { Edit } from "lucide-react";
import { ProfilePicture } from "@/components/ProfilePicture";

export const ProfileHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-apple p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ProfilePicture />
          <div>
            <h2 className="font-semibold text-lg text-gray-900">
              {user?.email?.split('@')[0]}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Edit profile"
        >
          <Edit className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};