import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const ResetPasswordSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="relative mx-auto w-24 h-24 bg-[#7F3DFF] rounded-full flex items-center justify-center">
          <Check className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-[#7F3DFF]">
            Password Reset Successful!
          </h1>
          <p className="text-gray-600">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
        </div>

        <Button
          onClick={() => navigate("/signin")}
          className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};