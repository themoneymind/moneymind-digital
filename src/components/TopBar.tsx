import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
}

export const TopBar = ({ title, showBackButton = true }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 left-0 right-0 bg-white z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-md mx-auto md:max-w-5xl">
        <div className="h-[56px] flex items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </div>
      </div>
    </header>
  );
};