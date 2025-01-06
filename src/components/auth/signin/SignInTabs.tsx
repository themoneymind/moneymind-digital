import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  biometricAvailable: boolean;
}

export const SignInTabs = ({ activeTab, onTabChange, biometricAvailable }: SignInTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-3 h-10 items-center bg-transparent rounded-full p-1" style={{ background: '#F1F1F1' }}>
      <TabsTrigger 
        value="password" 
        className={`flex-1 h-8 text-sm font-medium transition-all duration-200 rounded-full ${
          activeTab === "password"
            ? "bg-[#9B51E0] text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-[#9B51E0]/10"
        }`}
      >
        Password
      </TabsTrigger>
      <TabsTrigger 
        value="otp" 
        className={`flex-1 h-8 text-sm font-medium transition-all duration-200 rounded-full ${
          activeTab === "otp"
            ? "bg-[#9B51E0] text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-[#9B51E0]/10"
        }`}
      >
        OTP
      </TabsTrigger>
      {biometricAvailable && (
        <TabsTrigger 
          value="biometric" 
          className={`flex-1 h-8 text-sm font-medium transition-all duration-200 rounded-full ${
            activeTab === "biometric"
              ? "bg-[#9B51E0] text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-[#9B51E0]/10"
          }`}
        >
          Bio
        </TabsTrigger>
      )}
    </TabsList>
  );
};