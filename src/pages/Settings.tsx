import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "@/components/settings/ProfileHeader";
import { Settings as SettingsIcon, Moon, Shield, Download, User, Bell, Lock, CreditCard, Goal, PieChart } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Switch } from "@/components/ui/switch";
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
      title: "ACCOUNT",
      items: [
        {
          icon: User,
          label: "Profile Settings",
          path: "/app/settings/account",
          color: "text-primary",
        },
        {
          icon: Bell,
          label: "Notifications",
          path: "/app/settings/notifications",
          color: "text-orange-500",
        },
        {
          icon: Shield,
          label: "Security",
          path: "/app/settings/security",
          color: "text-purple-500",
        },
      ],
    },
    {
      title: "PREFERENCES",
      items: [
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
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                  document.documentElement.classList.toggle("dark", checked);
                }}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: "FINANCE",
      items: [
        {
          icon: CreditCard,
          label: "Payment Methods",
          path: "/app/settings/payment-methods",
          color: "text-green-500",
        },
        {
          icon: PieChart,
          label: "Categories",
          path: "/app/settings/categories",
          color: "text-blue-500",
        },
        {
          icon: Goal,
          label: "Financial Goals",
          path: "/app/settings/goals",
          color: "text-yellow-500",
        },
        {
          icon: Download,
          label: "Export Data",
          onClick: handleExportData,
          color: "text-indigo-500",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#F5F5F7]/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-semibold dark:text-white">Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
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
                      onClick={item.onClick || (item.path ? () => navigate(item.path) : undefined)}
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
    </div>
  );
};

export default Settings;