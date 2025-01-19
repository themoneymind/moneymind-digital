import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResendOtpButton } from "./ResendOtpButton";

interface OtpVerificationStepProps {
  otp: string;
  setOtp: (value: string) => void;
  handleVerifyOtp: () => void;
  handleResendOtp: () => void;
  isLoading: boolean;
  cooldownTime: number;
}

export const OtpVerificationStep = ({
  otp,
  setOtp,
  handleVerifyOtp,
  handleResendOtp,
  isLoading,
  cooldownTime,
}: OtpVerificationStepProps) => {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full py-3 md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
        maxLength={6}
        required
        disabled={isLoading}
      />
      <Button 
        onClick={handleVerifyOtp}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading || !otp}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      <ResendOtpButton
        cooldownTime={cooldownTime}
        onResend={handleResendOtp}
        isLoading={isLoading}
      />
    </div>
  );
};