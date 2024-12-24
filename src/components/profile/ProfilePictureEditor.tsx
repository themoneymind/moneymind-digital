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

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / scale;
    const y = (e.clientY - bounds.top) / scale;
    onPositionChange({ x, y });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.border = "2px dashed #4F46E5";
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = "2px solid transparent";
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div 
        className={`relative w-32 h-32 cursor-move rounded-full overflow-hidden border-2 transition-all duration-200 ${
          isDragging ? 'border-primary' : 'border-transparent'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrag}
        onDragEnd={handleDragEnd}
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
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center'
            }}
            draggable="true"
          />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-500">Zoom ({(scale * 100).toFixed(0)}%)</label>
          <span className="text-xs text-gray-400">{scale.toFixed(1)}x</span>
        </div>
        <Slider
          min={0.5}
          max={2}
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
  );
};