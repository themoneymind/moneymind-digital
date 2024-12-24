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

  const isSettingsRoute = location.pathname.startsWith('/app/settings');

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0">
        <div className="max-w-md mx-auto">
          <div className="relative bg-white border-t border-gray-100 shadow-lg">
            <div className="flex justify-around items-center p-3">
              {[
                { icon: Home, label: "Home", path: "/app" },
                { icon: Wallet2, label: "Dues", path: "/app/dues" },
                { icon: LineChart, label: "Report", path: "/app/report" },
                { icon: Settings, label: "Settings", path: "/app/settings" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center z-10 transition-colors duration-200 relative",
                    isActive(item.path) && "before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2 before:w-8 before:h-[2px] before:bg-[#7F3DFF]"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "w-5 h-5 stroke-[1.5]",
                      isActive(item.path) 
                        ? "text-[#7F3DFF]" 
                        : "text-gray-700 hover:text-gray-900"
                    )} 
                  />
                  <span 
                    className={cn(
                      "text-[10px] font-medium mt-1",
                      isActive(item.path)
                        ? "text-[#7F3DFF]"
                        : "text-gray-700"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Floating FAB Button - Hidden on settings routes */}
      {!isSettingsRoute && (
        <button
          onClick={() => setShowTransactionDialog(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all animate-fade-in z-50 md:right-8"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #6366F1)"
          }}
        >
          <Plus className="w-6 h-6 text-white stroke-[1.25]" />
        </button>
      )}

      {/* Transaction Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <NewTransaction />
        </DialogContent>
      </Dialog>
    </>
  );
};