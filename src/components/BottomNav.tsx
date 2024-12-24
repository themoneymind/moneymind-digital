import { Home, Wallet, Plus, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <>
      {/* Floating Action Button */}
      <Link
        to="/app/payment-source"
        className="fixed bottom-20 right-6 z-50 bg-[#7F3DFF] p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-around px-6 py-2">
          <Link
            to="/app"
            className={`flex flex-col items-center p-2 ${
              isActive("/app") ? "text-[#7F3DFF]" : "text-gray-700"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/app/report"
            className={`flex flex-col items-center p-2 ${
              isActive("/app/report") ? "text-[#7F3DFF]" : "text-gray-700"
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs mt-1">Report</span>
          </Link>
          <div className="w-16" /> {/* Spacer for floating button */}
          <Link
            to="/app/wallet"
            className={`flex flex-col items-center p-2 ${
              isActive("/app/wallet") ? "text-[#7F3DFF]" : "text-gray-700"
            }`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs mt-1">Wallet</span>
          </Link>
          <Link
            to="/app/settings"
            className={`flex flex-col items-center p-2 ${
              isActive("/app/settings") ? "text-[#7F3DFF]" : "text-gray-700"
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>
    </>
  );
};