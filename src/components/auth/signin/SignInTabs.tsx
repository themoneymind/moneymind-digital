import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  biometricAvailable: boolean;
}

export const SignInTabs = ({ activeTab, onTabChange, biometricAvailable }: SignInTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-3 h-12 items-center bg-[#F1F1F1] rounded-[32px] p-1">
      <TabsTrigger 
        value="password" 
        className={`flex-1 h-10 text-sm font-medium transition-all duration-200 rounded-[24px] ${
          activeTab === "password"
            ? "bg-[#7F3DFF] text-white shadow-none"
            : "text-gray-600 hover:text-gray-900 hover:bg-[#7F3DFF]/10"
        }`}
      >
        Password
      </TabsTrigger>
      <TabsTrigger 
        value="otp" 
        className={`flex-1 h-10 text-sm font-medium transition-all duration-200 rounded-[24px] ${
          activeTab === "otp"
            ? "bg-[#7F3DFF] text-white shadow-none"
            : "text-gray-600 hover:text-gray-900 hover:bg-[#7F3DFF]/10"
        }`}
      >
        OTP
      </TabsTrigger>
      {biometricAvailable && (
        <TabsTrigger 
          value="biometric" 
          className={`flex-1 h-10 text-sm font-medium transition-all duration-200 rounded-[24px] ${
            activeTab === "biometric"
              ? "bg-[#7F3DFF] text-white shadow-none"
              : "text-gray-600 hover:text-gray-900 hover:bg-[#7F3DFF]/10"
          }`}
        >
          Bio
        </TabsTrigger>
      )}
    </TabsList>
  );
};