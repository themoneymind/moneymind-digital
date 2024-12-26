import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { DuesForm } from "@/components/dues/DuesForm";
import { DuesBalanceCard } from "@/components/dues/DuesBalanceCard";

const Dues = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <TopBar title="Dues" />
      
      {/* Decorative Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      
      <main className="pb-24 pt-[64px]">
        <div className="px-4 space-y-4">
          <DuesBalanceCard />
          <DuesForm />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dues;