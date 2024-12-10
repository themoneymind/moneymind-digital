import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

type ProfilePictureUploaderProps = {
  imageUrl: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfilePictureUploader = ({ imageUrl, onFileSelect }: ProfilePictureUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  return (
    <>
      <Avatar 
        className="w-8 h-8 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
      >
        <AvatarImage 
          src={imageUrl || "/placeholder.svg"} 
          alt="Profile" 
          className="object-cover"
        />
        <AvatarFallback>
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileSelect}
      />
    </>
  );
};