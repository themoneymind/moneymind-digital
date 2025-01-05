import { Button } from "@/components/ui/button";
import { Mail, KeyRound } from "lucide-react";

interface PinSignInProps {
  email: string;
  setEmail: (email: string) => void;
  pin: string;
  setPin: (pin: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const PinSignIn = ({
  email,
  setEmail,
  pin,
  setPin,
  handleSubmit,
  isLoading,
}: PinSignInProps) => {
  const handlePinChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setPin(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
          <Mail className="h-4 w-4 text-[#7F3DFF]" />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
          disabled={isLoading}
          required
        />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
          <KeyRound className="h-4 w-4 text-[#7F3DFF]" />
        </div>
        <input
          type="password"
          inputMode="numeric"
          pattern="\d*"
          maxLength={6}
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => handlePinChange(e.target.value)}
          className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
          disabled={isLoading}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In with PIN"}
      </Button>
    </form>
  );
};