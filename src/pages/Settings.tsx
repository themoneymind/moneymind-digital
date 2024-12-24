import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ProfileHeader } from "@/components/settings/ProfileHeader";
import { Settings as SettingsIcon, Bell, Shield, Moon, Lock, User } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "GENERAL",
      items: [
        {
          icon: User,
          label: "Account",
          path: "/app/settings/account",
          color: "text-primary",
        },
        {
          icon: Moon,
          label: "Display",
          path: "/app/settings/display",
          color: "text-blue-500",
        },
      ],
    },
    {
      title: "FEEDBACK",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          path: "/app/settings/notifications",
          color: "text-green-500",
        },
        {
          icon: Shield,
          label: "Security",
          path: "/app/settings/security",
          color: "text-purple-500",
        },
        {
          icon: Lock,
          label: "Privacy",
          path: "/app/settings/privacy",
          color: "text-orange-500",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#F5F5F7]/80 border-b border-gray-200">
        <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-3">
          <SettingsIcon className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 pb-20 space-y-6">
        <ProfileHeader />
        
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-medium text-gray-500 px-4 mb-2">
                {section.title}
              </h2>
              <div className="bg-white rounded-apple shadow-sm">
                <div className="divide-y divide-gray-100">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-gray-700 font-medium">{item.label}</span>
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