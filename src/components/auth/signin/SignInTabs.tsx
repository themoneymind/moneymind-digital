import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Fingerprint, MessageSquare } from "lucide-react";

interface SignInTabsProps {
  biometricAvailable: boolean;
}

export const SignInTabs = ({ biometricAvailable }: SignInTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-12 items-stretch bg-gray-100 rounded-xl p-1">
      <TabsTrigger
        value="password"
        className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7F3DFF] data-[state=active]:shadow-sm"
      >
        <Key className="h-4 w-4 mr-2" />
        Password
      </TabsTrigger>
      <TabsTrigger
        value="otp"
        className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7F3DFF] data-[state=active]:shadow-sm"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        OTP
      </TabsTrigger>
      {biometricAvailable && (
        <TabsTrigger
          value="biometric"
          className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7F3DFF] data-[state=active]:shadow-sm"
        >
          <Fingerprint className="h-4 w-4 mr-2" />
          Biometric
        </TabsTrigger>
      )}
    </TabsList>
  );
};