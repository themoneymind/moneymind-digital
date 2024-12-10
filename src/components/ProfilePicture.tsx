import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ProfilePicture = () => {
  const [scale, setScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch profile picture on component mount
  const fetchProfilePicture = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_url) {
      setImageUrl(profile.avatar_url);
    }
  };

  useState(() => {
    fetchProfilePicture();
  }, [user]);

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
            },
            'image/jpeg',
            0.7
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
        setIsOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(event.target.value));
  };

  const handleSave = async () => {
    if (!user || !imageUrl) return;
    
    setIsLoading(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) return;

      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
      
      const filePath = `${user.id}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setImageUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Avatar 
        className="w-16 h-16 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
      >
        <AvatarImage 
          src={imageUrl || "/placeholder.svg"} 
          alt="Profile" 
          className="object-cover"
          style={{ transform: `scale(${scale})` }}
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
        onChange={handleFileChange}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={imageUrl || "/placeholder.svg"}
                alt="Profile" 
                className="object-cover"
                style={{ transform: `scale(${scale})` }}
              />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="w-full max-w-xs space-y-2">
              <label className="text-sm text-gray-500">Scale</label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
                className="w-full"
              />
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};