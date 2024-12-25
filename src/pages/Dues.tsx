import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

const Dues = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] relative overflow-hidden">
      <TopBar title="Dues" />
      
      {/* Decorative Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      
      <div className="p-4">
        {/* Content will be added later */}
      </div>
      <BottomNav />
    </div>
  );
};

export default Dues;