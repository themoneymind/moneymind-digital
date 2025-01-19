import { useState } from "react";
import { ImagePreview } from "./ImagePreview";
import { Position } from "./types";

interface DragHandlerProps {
  scale: number;
  position: Position;
  imageUrl: string | null;
  onPositionChange: (position: Position) => void;
}

export const DragHandler = ({
  scale,
  position,
  imageUrl,
  onPositionChange,
}: DragHandlerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });

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
    
    // Calculate maximum offset based on scale
    const maxOffset = 100 * (scale - 1);
    const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
    
    onPositionChange({ x: boundedX, y: boundedY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="cursor-move"
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <ImagePreview
        scale={scale}
        position={position}
        imageUrl={imageUrl}
        isDragging={isDragging}
      />
    </div>
  );
};