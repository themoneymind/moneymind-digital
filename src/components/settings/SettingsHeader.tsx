import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SettingsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="flex items-center gap-4 p-4 bg-white border-b">
      <button 
        onClick={() => navigate(-1)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>
      <h1 className="text-xl font-semibold">Settings</h1>
    </header>
  );
};