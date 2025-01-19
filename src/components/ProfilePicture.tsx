import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfilePictureUploader } from "./profile/ProfilePictureUploader";
import { ProfilePictureEditor } from "./profile/ProfilePictureEditor";
import { Position } from "./profile/types";

export const ProfilePicture = () => {
  const [scale, setScale] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    if (user) {
      fetchProfilePicture();
    }
  }, [user]);

  const fetchProfilePicture = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_url) {
      const img = new Image();
      img.src = profile.avatar_url;
      img.onload = () => {
        setImageUrl(profile.avatar_url);
      };
    }
  };

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Set canvas size to final desired dimensions
          const SIZE = 400;
          canvas.width = SIZE;
          canvas.height = SIZE;

          // Calculate scaled dimensions
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Calculate centering offsets including the position adjustment
          const centerX = (SIZE - scaledWidth) / 2 + position.x;
          const centerY = (SIZE - scaledHeight) / 2 + position.y;

          // Apply transformations in the correct order
          ctx.save();
          ctx.translate(SIZE / 2, SIZE / 2);
          ctx.scale(scale, scale);
          ctx.translate(-SIZE / 2, -SIZE / 2);
          
          // Draw the image with position adjustments
          ctx.drawImage(
            img,
            centerX / scale,
            centerY / scale,
            img.width,
            img.height
          );
          ctx.restore();

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
            },
            'image/jpeg',
            0.9
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setIsOpen(true);
      // Reset position and scale when new image is selected
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  };

  const handleSave = async () => {
    if (!user || !selectedFile) return;
    
    setIsLoading(true);
    try {
      const compressedBlob = await compressImage(selectedFile);
      const compressedFile = new File([compressedBlob], selectedFile.name, { type: 'image/jpeg' });
      
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
      setSelectedFile(null);
    }
  };

  return (
    <>
      <ProfilePictureUploader 
        imageUrl={imageUrl}
        onFileSelect={handleFileChange}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Profile Picture</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <ProfilePictureEditor
              imageUrl={imageUrl}
              scale={scale}
              position={position}
              onScaleChange={(e) => setScale(Number(e.target.value))}
              onPositionChange={setPosition}
              onSave={handleSave}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};