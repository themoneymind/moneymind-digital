import { PiggyBank } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { ResetPasswordForm } from "@/components/auth/reset-password/ResetPasswordForm";
import { useResetPassword } from "@/hooks/useResetPassword";

export const ResetPassword = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleResetPassword,
  } = useResetPassword();

  return (
    <div className="min-h-screen bg-[#F5F3FF] relative overflow-hidden">
      <TopBar title="Reset Password" />
      
      {/* Decorative Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      
      <div className="p-6 pt-8">
        <div className="space-y-6">
          <div className="text-left space-y-2">
            <div className="flex items-center mb-2">
              <PiggyBank className="h-10 w-10 text-[#7F3DFF]" />
            </div>
            <h1 className="text-2xl font-bold text-[#7F3DFF]">Reset Password</h1>
            <p className="text-gray-600 text-base">
              Enter your new password
            </p>
          </div>

          <ResetPasswordForm
            password={password}
            confirmPassword={confirmPassword}
            isLoading={isLoading}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleResetPassword}
          />
        </div>
      </div>
    </div>
  );
};