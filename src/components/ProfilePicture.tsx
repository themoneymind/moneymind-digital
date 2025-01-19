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
import { processImageForCanvas } from "@/utils/imageProcessing";

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
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  };

  const handleSave = async () => {
    if (!user || !selectedFile) return;
    
    setIsLoading(true);
    try {
      const processedBlob = await processImageForCanvas(selectedFile, scale, position);
      const compressedFile = new File([processedBlob], selectedFile.name, { type: 'image/jpeg' });
      
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