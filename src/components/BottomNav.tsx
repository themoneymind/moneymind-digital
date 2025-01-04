import { Link, useLocation } from "react-router-dom";
import { Home, PieChart, Plus, Wallet, Settings } from "lucide-react";

export const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 z-50">
      <div className="max-w-md mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <Link
            to="/app"
            className={`p-2 rounded-lg transition-colors ${
              isActive("/app") && !isActive("/app/settings")
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <Home className="w-6 h-6" />
          </Link>

          <Link
            to="/app/report"
            className={`p-2 rounded-lg transition-colors ${
              isActive("/report")
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <PieChart className="w-6 h-6" />
          </Link>

          <Link
            to="/app/payment-source"
            className={`p-2 rounded-lg transition-colors ${
              isActive("/payment-source")
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <Wallet className="w-6 h-6" />
          </Link>

          <Link
            to="/app/settings"
            className={`p-2 rounded-lg transition-colors ${
              isActive("/settings")
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
};