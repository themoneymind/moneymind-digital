import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

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
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDragging || !e.clientX || !e.clientY) return;
    
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    
    onPositionChange({ 
      x: Math.max(-50, Math.min(50, x - bounds.width / 2)),
      y: Math.max(-50, Math.min(50, y - bounds.height / 2))
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Drag to adjust position and use slider to zoom
      </div>
      
      <div 
        className="relative w-48 h-48 cursor-move rounded-full overflow-hidden border-2 border-primary"
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-full" />
        <Avatar className="w-full h-full">
          <AvatarImage 
            src={imageUrl || "/placeholder.svg"}
            alt="Profile" 
            className="object-cover transition-transform duration-200"
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

      <div className="w-full max-w-xs space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Zoom Level: {scale.toFixed(1)}x
          </label>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={[scale]}
            onValueChange={(value) => onScaleChange({ target: { value: value[0] } } as any)}
            className="w-full"
          />
        </div>

        <Button 
          onClick={onSave} 
          disabled={isLoading} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};