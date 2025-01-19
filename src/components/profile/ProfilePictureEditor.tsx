import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DraggableArea } from "./DraggableArea";
import { ScaleControl } from "./ScaleControl";
import { Position } from "./types";

interface ProfilePictureEditorProps {
  imageUrl: string | null;
  scale: number;
  position: Position;
  onScaleChange: (e: { target: { value: string } }) => void;
  onPositionChange: (position: Position) => void;
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
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseDown={() => setIsDragging(true)}
      >
        <DraggableArea
          scale={scale}
          position={position}
          imageUrl={imageUrl}
          onPositionChange={onPositionChange}
          isDragging={isDragging}
        />
      </div>

      <div className="w-full max-w-xs space-y-4">
        <ScaleControl scale={scale} onScaleChange={onScaleChange} />

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