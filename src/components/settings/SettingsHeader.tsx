import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SettingsHeaderProps = {
  title: string;
};

export const SettingsHeader = ({ title }: SettingsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#F5F5F7]/80 border-b border-gray-200">
      <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
    </header>
  );
};