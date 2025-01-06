import { useRef, useEffect } from "react";
import { isPhoneNumber } from "@/utils/phoneInputUtils";

export const useContactInput = (contact: string, inputType: 'email' | 'phone') => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number>(0);

  useEffect(() => {
    if (!inputRef.current || inputType !== 'phone' || !isPhoneNumber(contact)) {
      return;
    }

    const input = inputRef.current;
    const position = Math.min(cursorPositionRef.current, contact.length);
    
    window.requestAnimationFrame(() => {
      if (document.activeElement === input) {
        input.setSelectionRange(position, position);
      }
    });
  }, [contact, inputType]);

  const updateCursorPosition = (input: HTMLInputElement) => {
    if (inputType === 'phone') {
      cursorPositionRef.current = input.selectionStart || 0;
    }
  };

  return {
    inputRef,
    updateCursorPosition,
  };
};