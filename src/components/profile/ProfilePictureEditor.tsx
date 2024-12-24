import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Slider } from "@/components/ui/slider";

type ProfilePictureEditorProps = {
  imageUrl: string | null;
  scale: number;
  position: { x: number; y: number };
  onScaleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSave: () => void;
  isLoading: boolean;
};

export const ProfilePictureEditor = ({
  imageUrl,
  scale,
  position,
  onScaleChange,
  onPositionChange,
  onSave,
  isLoading,
}: ProfilePictureEditorProps) => {
  const { user } = useAuth();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    onPositionChange({ x, y });
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div 
        className="relative w-32 h-32 cursor-move"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrag}
      >
        <Avatar className="w-32 h-32">
          <AvatarImage 
            src={imageUrl || "/placeholder.svg"}
            alt="Profile" 
            className="object-cover"
            style={{ 
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center'
            }}
          />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full max-w-xs space-y-2">
        <label className="text-sm text-gray-500">Scale</label>
        <Slider
          min={0.5}
          max={2}
          step={0.1}
          value={[scale]}
          onValueChange={(value) => onScaleChange({ target: { value: value[0] } } as any)}
          className="w-full"
        />
      </div>
      <p className="text-sm text-gray-500">
        Drag the image to adjust position
      </p>
      <Button onClick={onSave} disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};