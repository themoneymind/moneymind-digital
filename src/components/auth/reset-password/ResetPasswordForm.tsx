import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResetPasswordFormProps {
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ResetPasswordForm = ({
  password,
  confirmPassword,
  isLoading,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        className="h-12 py-3 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0"
        disabled={isLoading}
        required
        minLength={6}
        aria-label="New password"
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        className="h-12 py-3 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0"
        disabled={isLoading}
        required
        minLength={6}
        aria-label="Confirm new password"
      />
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading}
      >
        {isLoading ? "Updating Password..." : "Reset Password"}
      </Button>
    </form>
  );
};