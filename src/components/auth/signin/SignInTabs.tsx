import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  biometricAvailable: boolean;
}

export const SignInTabs = ({ activeTab, onTabChange, biometricAvailable }: SignInTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-3 h-10 items-center bg-[#F1F1F1] rounded-full p-1">
      <TabsTrigger 
        value="password" 
        className={`flex-1 h-8 text-sm font-medium transition-all duration-200 rounded-full ${
          activeTab === "password"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
        }`}
      >
        Password
      </TabsTrigger>
      <TabsTrigger 
        value="otp" 
        className={`flex-1 h-8 text-sm font-medium transition-all duration-200 rounded-full ${
          activeTab === "otp"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
        }`}
      >
        OTP
      </TabsTrigger>
      {biometricAvailable && (
        <TabsTrigger 
          value="biometric" 
          className={`flex-1 h-8 text-sm font-medium transition-all duration-200 rounded-full ${
            activeTab === "biometric"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
          }`}
        >
          Bio
        </TabsTrigger>
      )}
    </TabsList>
  );
};