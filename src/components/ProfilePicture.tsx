import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ProfilePicture = () => {
  const [scale, setScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState("/lovable-uploads/e9fc4495-d8ba-4dcb-82a4-48a4e9bb6d1c.png");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-16 h-16 cursor-pointer hover:opacity-90 transition-opacity"
        style={{ transform: `scale(${scale})` }}
        onClick={() => fileInputRef.current?.click()}>
        <AvatarImage src={imageUrl} alt="Profile" className="object-cover" />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="w-full max-w-xs">
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
    </div>
  );
};