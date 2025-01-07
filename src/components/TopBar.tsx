import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TopBarProps = {
  title: string;
};

export const TopBar = ({ title }: TopBarProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-10">
      <div className="bg-[#7F3DFF] pb-8">
        <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
        </div>
      </div>
      <div className="h-6 bg-[#F5F5F7] dark:bg-gray-900 relative -mt-6 rounded-t-[28px]" />
    </header>
  );
};