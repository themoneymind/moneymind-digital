import { Settings, Bell, Shield, Lock, User } from "lucide-react";

type SettingsMenuProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
};

export const SettingsMenu = ({ activeSection, onSectionChange }: SettingsMenuProps) => {
  const menuItems = [
    {
      icon: Settings,
      label: "Display",
      id: "display",
      color: "text-primary",
    },
    {
      icon: Bell,
      label: "Notifications",
      id: "notifications",
      color: "text-blue-500",
    },
    {
      icon: Shield,
      label: "Security",
      id: "security",
      color: "text-green-500",
    },
    {
      icon: Lock,
      label: "Privacy",
      id: "privacy",
      color: "text-purple-500",
    },
    {
      icon: User,
      label: "Account",
      id: "account",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="bg-white rounded-apple shadow-sm">
      <div className="divide-y divide-gray-100">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left ${
              activeSection === item.id ? "bg-gray-50" : ""
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-gray-700 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};