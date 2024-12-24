import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ProfileHeader } from "@/components/settings/ProfileHeader";
import { Settings as SettingsIcon, Moon, Shield, Download, LogOut, User, Bell, Lock } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const handleExportData = () => {
    toast.info("Data export coming soon!");
  };

  const settingsSections = [
    {
      title: "GENERAL",
      items: [
        {
          icon: User,
          label: "Account",
          onClick: () => navigate("/app/settings/account"),
          color: "text-primary",
        },
        {
          icon: Moon,
          label: "Dark Mode",
          customContent: (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">Dark Mode</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          ),
        },
        {
          icon: Bell,
          label: "Notifications",
          onClick: () => navigate("/app/settings/notifications"),
          color: "text-orange-500",
        },
      ],
    },
    {
      title: "SECURITY",
      items: [
        {
          icon: Shield,
          label: "Security",
          onClick: () => navigate("/app/settings/security"),
          color: "text-purple-500",
        },
        {
          icon: Lock,
          label: "Privacy",
          onClick: () => navigate("/app/settings/privacy"),
          color: "text-green-500",
        },
        {
          icon: Download,
          label: "Export Data",
          onClick: handleExportData,
          color: "text-blue-500",
        },
        {
          icon: LogOut,
          label: "Logout",
          onClick: signOut,
          color: "text-red-500",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-gray-900">
      {/* Header with curved bottom */}
      <header className="sticky top-0 z-10">
        <div className="bg-[#7F3DFF] pb-6">
          <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 pt-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
          </div>
        </div>
        {/* Curved white overlay for content area */}
        <div className="h-5 bg-[#F5F5F7] dark:bg-gray-900 relative -mt-5 rounded-t-[20px]" />
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-20 space-y-6 -mt-3">
        <ProfileHeader />
        
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4 mb-2">
                {section.title}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-apple shadow-sm">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      {item.customContent || (
                        <>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="text-gray-700 dark:text-gray-200 font-medium">{item.label}</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;