import { Home, Wallet2, LineChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around p-3 max-w-md mx-auto">
        {[
          { icon: Home, label: "Dashboard", path: "/app" },
          { icon: Wallet2, label: "Dues", path: "/app/dues" },
          { icon: LineChart, label: "Report", path: "/app/report" },
          { icon: Settings, label: "Settings", path: "/app/settings" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center",
              isActive(item.path) ? "text-primary" : "text-gray-400"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};