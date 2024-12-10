import { Input } from "@/components/ui/input";

interface SignUpInputsProps {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setPassword: (value: string) => void;
  isLoading: boolean;
}

export const SignUpInputs = ({
  fullName,
  email,
  phoneNumber,
  password,
  setFullName,
  setEmail,
  setPhoneNumber,
  setPassword,
  isLoading,
}: SignUpInputsProps) => {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter your name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="h-14 rounded-[12px] bg-gray-50"
        disabled={isLoading}
        required
      />
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-14 rounded-[12px] bg-gray-50"
        disabled={isLoading}
        required
      />
      <Input
        type="tel"
        placeholder="Enter your mobile number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="h-14 rounded-[12px] bg-gray-50"
        disabled={isLoading}
        required
      />
      <Input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-14 rounded-[12px] bg-gray-50"
        disabled={isLoading}
        required
      />
    </div>
  );
};