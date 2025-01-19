import { useState } from "react";

export const usePasswordValidation = () => {
  const [showRequirements, setShowRequirements] = useState(false);

  const validatePassword = (value: string) => {
    // Show requirements when user starts typing
    if (value.length === 1) {
      setShowRequirements(true);
    }
    
    // Hide requirements when all conditions are met
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value);
    if (isValid) {
      setShowRequirements(false);
    }
  };

  return {
    showRequirements,
    validatePassword,
  };
};