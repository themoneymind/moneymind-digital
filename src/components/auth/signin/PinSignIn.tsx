import { useOtpSignIn } from "@/hooks/useOtpSignIn";
import { ContactInputStep } from "./ContactInputStep";
import { OtpVerificationStep } from "./OtpVerificationStep";

interface OtpSignInProps {
  isLoading: boolean;
}

export const PinSignIn = ({
  isLoading,
}: OtpSignInProps) => {
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
    <div className="space-y-6">
      {otpSent ? (
        <OtpVerificationStep
          otp={otp}
          setOtp={setOtp}
          handleVerifyOtp={handleVerifyOtp}
          isLoading={isLoading}
        />
      ) : (
        <ContactInputStep
          contact={contact}
          setContact={setContact}
          handleSendOtp={handleSendOtp}
          isLoading={isLoading || cooldownTime > 0}
        />
      )}
    </div>
  );
};