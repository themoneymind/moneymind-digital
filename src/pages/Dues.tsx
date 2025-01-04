import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { DuesForm } from "@/components/dues/DuesForm";
import { DuesBalanceCard } from "@/components/dues/DuesBalanceCard";
import { DuesTransactionsList } from "@/components/dues/DuesTransactionsList";

const Dues = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <TopBar title="Dues" />
      
      <main className="pb-20 pt-[56px]">
        <div className="max-w-md mx-auto md:max-w-5xl px-4 md:px-6 lg:px-8 space-y-3">
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