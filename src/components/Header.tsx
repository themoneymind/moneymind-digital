import { ArrowLeft, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export const Header = () => {
  return (
    <header className="flex flex-col space-y-4 p-4 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
          <Avatar className="w-10 h-10">
            <img src="/lovable-uploads/e9fc4495-d8ba-4dcb-82a4-48a4e9bb6d1c.png" alt="Profile" className="object-cover" />
          </Avatar>
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">Elumalai Ravi</h2>
        <p className="text-sm text-gray-500">Building wealth together</p>
      </div>
    </header>
  );
};