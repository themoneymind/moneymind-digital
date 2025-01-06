import { useOtpAuth } from "@/hooks/useOtpAuth";
import { ContactInputStep } from "./ContactInputStep";
import { OtpVerificationStep } from "./OtpVerificationStep";

interface OtpSignInProps {
  isLoading: boolean;
}

export const PinSignIn = ({
  isLoading: parentIsLoading,
}: OtpSignInProps) => {
  const {
    otpSent,
    otp,
    setOtp,
    contact,
    setContact,
    isLoading,
    handleSendOtp,
    handleVerifyOtp,
  } = useOtpAuth();

  return (
    <div className="space-y-6">
      {otpSent ? (
        <OtpVerificationStep
          otp={otp}
          setOtp={setOtp}
          handleVerifyOtp={handleVerifyOtp}
          isLoading={isLoading || parentIsLoading}
        />
      ) : (
        <ContactInputStep
          contact={contact}
          setContact={setContact}
          handleSendOtp={handleSendOtp}
          isLoading={isLoading || parentIsLoading}
        />
      )}
    </div>
  );
};