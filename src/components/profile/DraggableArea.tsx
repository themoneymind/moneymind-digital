import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { DraggableAreaProps, Position } from "./types";

export const DraggableArea = ({
  scale,
  position,
  imageUrl,
  onPositionChange,
  isDragging,
}: DraggableAreaProps) => {
  const { user } = useAuth();
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;
    
    const maxOffset = 100 * (scale - 1);
    const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
    
    onPositionChange({ x: boundedX, y: boundedY });
  };

  return (
    <div 
      className={`relative w-32 h-32 cursor-move rounded-full overflow-hidden border-2 transition-all duration-200 ${
        isDragging ? 'border-primary' : 'border-dashed border-gray-300 hover:border-primary/50'
      }`}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      style={{ 
        background: "rgba(0,0,0,0.05)",
      }}
    >
      <div className="absolute inset-0 grid place-items-center pointer-events-none opacity-50">
        <div className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-full" />
      </div>
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
  );
};