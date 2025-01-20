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
import { Button } from "./ui/button";

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
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile?.avatar_url) {
        // Validate and clean the URL
        try {
          const url = new URL(profile.avatar_url);
          setImageUrl(url.toString());
        } catch (e) {
          console.error('Invalid URL format:', e);
          setImageUrl(null);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfilePicture:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile picture",
        variant: "destructive",
      });
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

  const handleProfileClick = () => {
    if (imageUrl) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setSelectedFile(null);
      setIsOpen(true);
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

      const { data } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Validate the URL before updating
      const validatedUrl = new URL(data.publicUrl).toString();

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: validatedUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setImageUrl(validatedUrl);
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
        onClick={handleProfileClick}
        hasExistingImage={!!imageUrl}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {imageUrl && (
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
            <div className="flex justify-center">
              <label className="cursor-pointer w-full">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <Button 
                  variant="outline" 
                  type="button"
                  className="w-full"
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }}
                >
                  Change Profile Picture
                </Button>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};