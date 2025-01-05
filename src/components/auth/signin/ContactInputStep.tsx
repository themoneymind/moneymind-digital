import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <div className="relative">
        <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
          <Mail className="h-4 w-4 text-[#7F3DFF]" />
        </div>
        <Input
          type="text"
          placeholder="Email or Phone Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
          disabled={isLoading}
          required
        />
      </div>

      <Button 
        onClick={handleSendOtp}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading || !contact}
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>
    </div>
  );
};