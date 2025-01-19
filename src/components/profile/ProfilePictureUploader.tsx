import { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

type ProfilePictureUploaderProps = {
  imageUrl: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenDialog: () => void;
};

export const ProfilePictureUploader = ({ 
  imageUrl, 
  onFileSelect,
  onOpenDialog 
}: ProfilePictureUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleClick = () => {
    onOpenDialog();
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <Avatar className="w-full h-full bg-primary/10 transition-opacity group-hover:opacity-90">
        <AvatarImage 
          src={imageUrl || "/placeholder.svg"} 
          alt="Profile" 
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileSelect}
      />
    </div>
  );
};