import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Settings as SettingsIcon, Download, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SettingsMenu = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: Wallet,
      label: "My Wallet",
      onClick: () => navigate("/app/wallet"),
      color: "text-primary",
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      onClick: () => navigate("/app/settings"),
      color: "text-blue-500",
    },
    {
      icon: Download,
      label: "Export Data",
      onClick: () => console.log("Export Data clicked"),
      color: "text-green-500",
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: signOut,
      color: "text-red-500",
    },
  ];

  return (
    <div className="bg-white rounded-apple shadow-sm">
      <div className="divide-y divide-gray-100">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-gray-700 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};