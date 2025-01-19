export interface Position {
  x: number;
  y: number;
}

export interface ImageEditorProps {
  scale: number;
  position: Position;
  imageUrl: string | null;
  onPositionChange: (position: Position) => void;
}

export interface DraggableAreaProps extends ImageEditorProps {
  isDragging: boolean;
}

export interface ScaleControlProps {
  scale: number;
  onScaleChange: (e: { target: { value: string } }) => void;
}