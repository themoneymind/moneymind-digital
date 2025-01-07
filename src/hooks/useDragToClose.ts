import { useRef, useCallback } from "react";

interface DragToCloseOptions {
  onClose: () => void;
  dragThreshold?: number;
}

export const useDragToClose = ({ onClose, dragThreshold = 100 }: DragToCloseOptions) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const lastTouchY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handleClose = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      sheetRef.current.style.transition = 'transform 0.3s ease-out';
    }
    onClose();
  }, [onClose]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const handle = e.target as HTMLElement;
    if (handle.getAttribute('role') === 'button') {
      dragStartY.current = e.touches[0].clientY;
      lastTouchY.current = e.touches[0].clientY;
      isDragging.current = true;
      if (sheetRef.current) {
        sheetRef.current.style.transition = 'none';
      }
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !sheetRef.current || !lastTouchY.current) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - lastTouchY.current;
    lastTouchY.current = currentY;

    if (sheetRef.current) {
      const currentTransform = sheetRef.current.style.transform;
      const currentY = currentTransform 
        ? parseInt(currentTransform.replace(/[^\d.-]/g, '')) 
        : 0;
      
      const newY = Math.max(0, currentY + deltaY);
      sheetRef.current.style.transform = `translateY(${newY}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current || !sheetRef.current || !dragStartY.current || !lastTouchY.current) return;

    const totalDrag = lastTouchY.current - dragStartY.current;
    
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 0.3s ease-out';
      
      if (totalDrag > dragThreshold) {
        handleClose();
      } else {
        sheetRef.current.style.transform = '';
      }
    }

    dragStartY.current = null;
    lastTouchY.current = null;
    isDragging.current = false;
  }, [dragThreshold, handleClose]);

  return {
    sheetRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleClose,
  };
};