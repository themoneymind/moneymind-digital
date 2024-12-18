import { useState, useCallback } from "react";

export const useDialogState = (onClose: (open: boolean) => void) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen && !isSubmitting && !isClosing) {
        setIsClosing(true);
        onClose(false);
      }
    },
    [isSubmitting, isClosing, onClose]
  );

  const startSubmitting = () => setIsSubmitting(true);
  const stopSubmitting = () => setIsSubmitting(false);
  const initiateClose = () => {
    setIsClosing(true);
    onClose(false);
  };
  const reset = () => {
    setIsClosing(false);
    setIsSubmitting(false);
  };

  return {
    isClosing,
    isSubmitting,
    handleOpenChange,
    startSubmitting,
    stopSubmitting,
    initiateClose,
    reset,
  };
};