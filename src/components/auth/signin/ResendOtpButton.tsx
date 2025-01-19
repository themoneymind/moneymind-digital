import { Button } from "@/components/ui/button";

interface ResendOtpButtonProps {
  cooldownTime: number;
  onResend: () => void;
  isLoading: boolean;
}

export const ResendOtpButton = ({
  cooldownTime,
  onResend,
  isLoading,
}: ResendOtpButtonProps) => {
  return (
    <div className="mt-4 text-center">
      <Button
        variant="ghost"
        onClick={onResend}
        disabled={cooldownTime > 0 || isLoading}
        className="text-sm text-gray-600 hover:text-[#7F3DFF]"
      >
        {cooldownTime > 0
          ? `Resend OTP in ${cooldownTime}s`
          : isLoading
          ? "Sending..."
          : "Resend OTP"}
      </Button>
    </div>
  );
};