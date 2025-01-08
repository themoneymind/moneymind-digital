import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OtpVerificationStepProps {
  otp: string;
  setOtp: (value: string) => void;
  handleVerifyOtp: () => void;
  isLoading: boolean;
}

export const OtpVerificationStep = ({
  otp,
  setOtp,
  handleVerifyOtp,
  isLoading,
}: OtpVerificationStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="text-center tracking-widest text-lg"
          disabled={isLoading}
        />
      </div>
      <Button
        onClick={handleVerifyOtp}
        disabled={!otp || isLoading}
        className="w-full"
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
};