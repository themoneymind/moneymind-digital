import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  biometricAvailable: boolean;
}

export const SignInTabs = ({ activeTab, onTabChange, biometricAvailable }: SignInTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-3 h-9 items-center bg-muted p-1 text-muted-foreground rounded-md">
      <TabsTrigger 
        value="password" 
        className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2"
      >
        Password
      </TabsTrigger>
      <TabsTrigger 
        value="otp" 
        className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2"
      >
        Login with OTP
      </TabsTrigger>
      {biometricAvailable && (
        <TabsTrigger 
          value="biometric" 
          className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2"
        >
          Biometric
        </TabsTrigger>
      )}
    </TabsList>
  );
};