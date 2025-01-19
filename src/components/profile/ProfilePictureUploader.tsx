import { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ProfilePictureUploaderProps = {
  imageUrl: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfilePictureUploader = ({ 
  imageUrl, 
  onFileSelect,
}: ProfilePictureUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
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
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">
              Choose a new profile picture to upload
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="w-full"
              accept="image/*"
              onChange={(e) => {
                onFileSelect(e);
                setIsOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};