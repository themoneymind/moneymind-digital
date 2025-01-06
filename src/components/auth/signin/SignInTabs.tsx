import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  biometricAvailable: boolean;
}

export const SignInTabs = ({ activeTab, onTabChange, biometricAvailable }: SignInTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-9 items-center text-xs sm:text-sm">
        <TabsTrigger value="password" className="px-1 sm:px-3">
          Password
        </TabsTrigger>
        <TabsTrigger value="otp" className="px-1 sm:px-3">
          Login with OTP
        </TabsTrigger>
        {biometricAvailable && (
          <TabsTrigger value="biometric" className="px-1 sm:px-3">
            Biometric
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
};