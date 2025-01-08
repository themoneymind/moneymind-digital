import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputIcon } from "./InputIcon";

interface ContactInputProps {
  contact: string;
  setContact: (value: string) => void;
  isLoading: boolean;
}

export const ContactInput = ({ contact, setContact, isLoading }: ContactInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <InputIcon />
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="pl-10"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};