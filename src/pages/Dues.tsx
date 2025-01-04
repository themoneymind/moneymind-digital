import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { DuesForm } from "@/components/dues/DuesForm";
import { DuesBalanceCard } from "@/components/dues/DuesBalanceCard";
import { DuesTransactionsList } from "@/components/dues/DuesTransactionsList";

const Dues = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <TopBar title="Dues" />
      
      <main className="pb-20 pt-[56px] max-w-[100vw] overflow-x-hidden">
        <div className="max-w-[100%] px-4 space-y-3">
          <DuesBalanceCard />
          <DuesForm />
          <DuesTransactionsList />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dues;