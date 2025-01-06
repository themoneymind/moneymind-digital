import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactInputStep } from "./ContactInputStep";
import { OtpVerificationStep } from "./OtpVerificationStep";

interface PinSignInProps {
  isLoading: boolean;
}

export const PinSignIn = ({ isLoading }: PinSignInProps) => {
  const [contact, setContact] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSendOtp = () => {
    // Implement OTP sending logic here
    setShowOtpInput(true);
  };

  const handleVerifyOtp = (otp: string) => {
    // Implement OTP verification logic here
    console.log("Verifying OTP:", otp);
  };

  const handleResendOtp = () => {
    // Implement OTP resend logic here
    console.log("Resending OTP");
  };

  return (
    <div className="space-y-6">
      {!showOtpInput ? (
        <ContactInputStep
          contact={contact}
          setContact={setContact}
          handleSendOtp={handleSendOtp}
          isLoading={isLoading}
        />
      ) : (
        <OtpVerificationStep
          contact={contact}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};