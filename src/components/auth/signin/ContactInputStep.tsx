import { Button } from "@/components/ui/button";
import { ContactInput } from "./ContactInput";

interface ContactInputStepProps {
  contact: string;
  setContact: (value: string) => void;
  handleSendOtp: () => void;
  isLoading: boolean;
  cooldownTime: number;
}

export const ContactInputStep = ({
  contact,
  setContact,
  handleSendOtp,
  isLoading,
  cooldownTime,
}: ContactInputStepProps) => {
  return (
    <div className="space-y-4">
      <ContactInput
        contact={contact}
        setContact={setContact}
        isLoading={isLoading}
      />
      <Button
        onClick={handleSendOtp}
        disabled={!contact || isLoading || cooldownTime > 0}
        className="w-full"
      >
        {cooldownTime > 0
          ? `Resend OTP in ${cooldownTime}s`
          : isLoading
          ? "Sending..."
          : "Send OTP"}
      </Button>
    </div>
  );
};