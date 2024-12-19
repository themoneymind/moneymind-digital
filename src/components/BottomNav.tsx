import { Home, Wallet2, LineChart, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NewTransaction } from "./NewTransaction";

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center p-3 max-w-md mx-auto relative">
          {[
            { icon: Home, label: "Dashboard", path: "/app" },
            { icon: Wallet2, label: "Dues", path: "/app/dues" },
            { icon: LineChart, label: "Report", path: "/app/report" },
            { icon: Settings, label: "Settings", path: "/app/settings" },
          ].map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center z-10",
                isActive(item.path) ? "text-primary" : "text-gray-400"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          ))}
          
          {/* FAB Button */}
          <button
            onClick={() => setShowTransactionDialog(true)}
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </nav>

      {/* Transaction Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <NewTransaction />
        </DialogContent>
      </Dialog>
    </>
  );
};