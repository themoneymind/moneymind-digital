import { Button } from "@/components/ui/button";
import { ContactInput } from "./ContactInput";

interface ContactInputStepProps {
  contact: string;
  setContact: (value: string) => void;
  handleSendOtp: () => void;
  isLoading: boolean;
}

export const ContactInputStep = ({
  contact,
  setContact,
  handleSendOtp,
  isLoading,
}: ContactInputStepProps) => {
  return (
    <div className="space-y-6">
      <ContactInput
        contact={contact}
        isLoading={isLoading}
        onContactChange={setContact}
      />

      <Button 
        onClick={handleSendOtp}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading || !contact}
      >
        {isLoading ? "Please wait..." : "Send OTP"}
      </Button>
    </div>
  );
};