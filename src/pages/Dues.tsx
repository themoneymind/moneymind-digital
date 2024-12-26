import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { DuesForm } from "@/components/dues/DuesForm";
import { DuesBalanceCard } from "@/components/dues/DuesBalanceCard";
import { DuesNotificationList } from "@/components/dues/DuesNotificationList";

const Dues = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      <TopBar title="Dues" />
      
      <main className="flex-1 overflow-auto pb-24 pt-[64px]">
        <div className="container mx-auto px-4 space-y-6">
          <DuesBalanceCard />
          <DuesForm />
          <DuesNotificationList />
        </div>
      </main>
      <BottomNav showFab={false} />
    </div>
  );
};

export default Dues;