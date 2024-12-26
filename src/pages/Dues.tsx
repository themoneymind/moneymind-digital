import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { DuesForm } from "@/components/dues/DuesForm";
import { DuesBalanceCard } from "@/components/dues/DuesBalanceCard";

const Dues = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <TopBar title="Dues" />
      
      <main className="pb-24 pt-[64px] max-w-[100vw] overflow-x-hidden">
        <div className="max-w-[100%] px-4 space-y-4">
          <DuesBalanceCard />
          <DuesForm />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dues;