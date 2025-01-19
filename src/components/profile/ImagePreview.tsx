import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Position } from "./types";

interface ImagePreviewProps {
  scale: number;
  position: Position;
  imageUrl: string | null;
  isDragging: boolean;
}

export const ImagePreview = ({
  scale,
  position,
  imageUrl,
  isDragging,
}: ImagePreviewProps) => {
  const { user } = useAuth();

  return (
    <div 
      className={`relative w-32 h-32 rounded-full overflow-hidden border-2 transition-all duration-200 ${
        isDragging ? 'border-primary' : 'border-dashed border-gray-300'
      }`}
      style={{ background: "rgba(0,0,0,0.05)" }}
    >
      {/* Grid overlay for visual guidance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-gray-300/20"
            />
          ))}
        </div>
      </div>
      
      {/* Center guide */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="w-16 h-16 border-2 border-dashed border-primary/30 rounded-full" />
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

      {/* Drag indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
          Drag to adjust
        </div>
      </div>
    </div>
  );
};