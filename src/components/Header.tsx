import { ArrowLeft, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center gap-4">
        <button className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2">
          <Bell className="w-5 h-5" />
        </button>
        <Avatar className="w-10 h-10">
          <img src="/lovable-uploads/7d996dcd-d651-4c77-8e0f-84d25450e901.png" alt="Profile" className="object-cover" />
        </Avatar>
      </div>
    </header>
  );
};