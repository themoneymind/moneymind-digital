import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInTabsProps {
  biometricAvailable: boolean;
}

export const SignInTabs = ({ biometricAvailable }: SignInTabsProps) => {
  return (
    <TabsList className="flex p-1 bg-gray-100 rounded-full gap-2 w-[80%] max-w-md mx-auto">
      <TabsTrigger
        value="password"
        className="flex-1 px-6 py-2 rounded-full text-sm transition-all data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500"
      >
        Password
      </TabsTrigger>
      <TabsTrigger
        value="otp"
        className="flex-1 px-6 py-2 rounded-full text-sm transition-all data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500"
      >
        Login with OTP
      </TabsTrigger>
      {biometricAvailable && (
        <TabsTrigger
          value="biometric"
          className="flex-1 px-6 py-2 rounded-full text-sm transition-all data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500"
        >
          Biometric
        </TabsTrigger>
      )}
    </TabsList>
  );
};