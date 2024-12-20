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
      <nav className="fixed bottom-0 left-0 right-0">
        <div className="max-w-md mx-auto">
          <div className="relative bg-white rounded-t-[20px] border-t border-gray-100 shadow-lg">
            <div className="flex justify-around items-center p-3">
              {[
                { icon: Home, label: "Home", path: "/app" },
                { icon: Wallet2, label: "Dues", path: "/app/dues" },
                { icon: LineChart, label: "Report", path: "/app/report" },
                { icon: Settings, label: "Settings", path: "/app/settings" },
              ].map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center z-10 transition-colors duration-200",
                    // Adjusted spacing for better FAB placement
                    index === 2 ? "mr-8" : index === 1 ? "ml-8" : "",
                    isActive(item.path) 
                      ? "text-primary" 
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <item.icon className="w-5 h-5 stroke-[1]" />
                  <span className="text-[10px] font-medium mt-1 text-gray-500">{item.label}</span>
                </button>
              ))}
              
              {/* FAB Button with updated styling */}
              <button
                onClick={() => setShowTransactionDialog(true)}
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all animate-fade-in"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #6366F1)"
                }}
              >
                <Plus className="w-6 h-6 text-white stroke-[1.25]" />
              </button>
            </div>
          </div>
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