import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";

export const EmailConfirmationSuccess = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = () => {
    // Clear any existing session to ensure fresh login
    localStorage.removeItem("sb-vnuxoxkozfgfrqjbsifs-auth-token");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col items-center justify-center p-4">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="relative mx-auto w-24 h-24 bg-[#7F3DFF] rounded-full flex items-center justify-center animate-scale-in">
          <Check className="w-12 h-12 text-white animate-fade-in" />
        </div>
        
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-2xl font-bold text-[#7F3DFF]">
            Email Confirmed Successfully!
          </h1>
          <p className="text-gray-600">
            Your email has been successfully verified. Please sign in to continue setting up your account.
          </p>
        </div>

        <Button
          onClick={handleSignIn}
          className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90 animate-fade-in"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};