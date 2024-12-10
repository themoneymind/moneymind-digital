import { useToast } from "@/hooks/use-toast";

export const useSignUpValidation = () => {
  const { toast } = useToast();

  const validateInputs = (fullName: string, email: string, password: string, phoneNumber: string) => {
    if (!fullName || !email || !password || !phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast({
        title: "Error",
        description: "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateInputs };
};