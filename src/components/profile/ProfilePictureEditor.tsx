import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ProfilePictureEditorProps {
  imageUrl: string | null;
  scale: number;
  position: { x: number; y: number };
  onScaleChange: (e: { target: { value: string } }) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSave: () => void;
  isLoading: boolean;
}

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
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;
    
    // Limit the dragging area based on scale
    const maxOffset = 100 * (scale - 1);
    const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
    
    onPositionChange({ x: boundedX, y: boundedY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div 
        className={`relative w-32 h-32 cursor-move rounded-full overflow-hidden border-2 transition-all duration-200 ${
          isDragging ? 'border-primary' : 'border-transparent'
        }`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ 
          background: "rgba(0,0,0,0.05)",
        }}
      >
        <Avatar className="w-32 h-32">
          <AvatarImage 
            src={imageUrl || "/placeholder.svg"}
            alt="Profile" 
            className="object-cover transition-transform duration-200"
            style={{ 
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transformOrigin: 'center',
              willChange: 'transform'
            }}
          />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-500">Zoom ({(scale * 100).toFixed(0)}%)</label>
            <span className="text-xs text-gray-400">{scale.toFixed(1)}x</span>
          </div>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={[scale]}
            onValueChange={([value]) => onScaleChange({ target: { value: value.toString() } })}
            className="w-full"
          />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm text-gray-500 font-medium">
            Drag to adjust position
          </p>
          <p className="text-xs text-gray-400">
            Click and drag the image to position it within the frame
          </p>
        </div>

        <Button 
          onClick={onSave} 
          disabled={isLoading} 
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};