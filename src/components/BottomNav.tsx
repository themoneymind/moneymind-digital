import { Home, IndianRupee, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around p-4">
        {[
          { icon: Home, label: "Dashboard", active: true },
          { icon: IndianRupee, label: "Dues" },
          { icon: Clock, label: "Report" },
          { icon: Settings, label: "Settings" },
        ].map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex flex-col items-center gap-1",
              item.active ? "text-blue-600" : "text-gray-500"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};