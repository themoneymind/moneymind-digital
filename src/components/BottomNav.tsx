import { Home, Wallet2, LineChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around p-3 max-w-md mx-auto">
        {[
          { icon: Home, label: "Dashboard", active: true },
          { icon: Wallet2, label: "Dues" },
          { icon: LineChart, label: "Report" },
          { icon: Settings, label: "Settings" },
        ].map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex flex-col items-center",
              item.active ? "text-primary" : "text-gray-400"
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