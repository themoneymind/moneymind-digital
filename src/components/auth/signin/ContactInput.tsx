import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface ContactInputProps {
  contact: string;
  isLoading: boolean;
  onContactChange: (value: string) => void;
}

export const ContactInput = ({
  contact,
  isLoading,
  onContactChange,
}: ContactInputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Mail className="h-4 w-4 text-[#7F3DFF]" />
      </div>
      <Input
        type="email"
        placeholder="Email"
        value={contact}
        onChange={(e) => onContactChange(e.target.value)}
        className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0"
        disabled={isLoading}
        required
      />
    </div>
  );
};