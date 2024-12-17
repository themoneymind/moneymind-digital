import { useState } from "react";

export const useCardSwipe = (totalCards: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    handleSwipe(currentX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    handleSwipe(currentX);
  };

  const handleSwipe = (currentX: number) => {
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < totalCards - 1) {
        setActiveIndex(prev => prev + 1);
        setIsDragging(false);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
        setIsDragging(false);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return {
    activeIndex,
    setActiveIndex,
    isDragging,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleDragEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleDragEnd,
      onMouseLeave: handleDragEnd,
    }
  };
};