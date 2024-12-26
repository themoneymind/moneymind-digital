import { Link, useLocation } from "react-router-dom";
import { Home, PieChart, Receipt, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type BottomNavProps = {
  showFab?: boolean;
};

export const BottomNav = ({ showFab = true }: BottomNavProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area-inset-bottom">
      {showFab && (location.pathname === "/" || location.pathname === "/report") && (
        <Link
          to="/transaction/new"
          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          <span className="sr-only">New Transaction</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      )}
      
      <nav className="flex justify-around py-2">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center px-4 py-2 text-xs",
            isActive("/")
              ? "text-blue-600"
              : "text-gray-600"
          )}
        >
          <Home className="w-6 h-6 mb-1" />
          Home
        </Link>
        <Link
          to="/report"
          className={cn(
            "flex flex-col items-center px-4 py-2 text-xs",
            isActive("/report")
              ? "text-blue-600"
              : "text-gray-600"
          )}
        >
          <PieChart className="w-6 h-6 mb-1" />
          Report
        </Link>
        <div className="w-[68px]" /> {/* Spacer for FAB */}
        <Link
          to="/dues"
          className={cn(
            "flex flex-col items-center px-4 py-2 text-xs",
            isActive("/dues")
              ? "text-blue-600"
              : "text-gray-600"
          )}
        >
          <Receipt className="w-6 h-6 mb-1" />
          Dues
        </Link>
        <Link
          to="/settings"
          className={cn(
            "flex flex-col items-center px-4 py-2 text-xs",
            isActive("/settings")
              ? "text-blue-600"
              : "text-gray-600"
          )}
        >
          <Settings className="w-6 h-6 mb-1" />
          Settings
        </Link>
      </nav>
    </div>
  );
};