import { useOtpSignIn } from "@/hooks/useOtpSignIn";
import { ContactInputStep } from "./ContactInputStep";
import { OtpVerificationStep } from "./OtpVerificationStep";

interface PinSignInProps {
  isLoading: boolean;
}

export const PinSignIn = ({ isLoading }: PinSignInProps) => {
  const {
    otpSent,
    otp,
    setOtp,
    contact,
    setContact,
    handleSendOtp,
    handleVerifyOtp,
    cooldownTime,
  } = useOtpSignIn();

  return (
    <div className="space-y-4">
      {!otpSent ? (
        <ContactInputStep
          contact={contact}
          setContact={setContact}
          handleSendOtp={handleSendOtp}
          isLoading={isLoading}
          cooldownTime={cooldownTime}
        />
      ) : (
        <OtpVerificationStep
          otp={otp}
          setOtp={setOtp}
          handleVerifyOtp={handleVerifyOtp}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};