import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type ProfilePictureEditorProps = {
  imageUrl: string | null;
  scale: number;
  onScaleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isLoading: boolean;
};

export const ProfilePictureEditor = ({
  imageUrl,
  scale,
  onScaleChange,
  onSave,
  isLoading,
}: ProfilePictureEditorProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <Avatar className="w-32 h-32">
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
          onChange={onScaleChange}
          className="w-full"
        />
      </div>
      <Button onClick={onSave} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};