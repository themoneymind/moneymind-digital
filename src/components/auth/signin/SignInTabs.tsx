import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiometricIcon } from "./BiometricIcon";
import { LockKeyhole, Smartphone } from "lucide-react";

interface SignInTabsProps {
  biometricAvailable: boolean;
}

export const SignInTabs = ({ biometricAvailable }: SignInTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg p-1">
      <TabsTrigger
        value="password"
        className="rounded-md data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
      >
        <div className="flex items-center gap-2">
          <LockKeyhole className="h-4 w-4" />
          <span>Password</span>
        </div>
      </TabsTrigger>
      <TabsTrigger
        value="otp"
        className="rounded-md data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          <span>OTP</span>
        </div>
      </TabsTrigger>
      {biometricAvailable && (
        <TabsTrigger
          value="biometric"
          className="rounded-md data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          <div className="flex items-center gap-2">
            <BiometricIcon className="h-4 w-4" />
            <span>Biometric</span>
          </div>
        </TabsTrigger>
      )}
    </TabsList>
  );
};