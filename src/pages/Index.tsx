import { Header } from "@/components/Header";
import { MonthSelector } from "@/components/MonthSelector";
import { BalanceCard } from "@/components/BalanceCard";
import { NewTransaction } from "@/components/NewTransaction";
import { RecentTransactions } from "@/components/RecentTransactions";
import { PaymentSources } from "@/components/PaymentSources";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <div className="space-y-4 py-4">
        <MonthSelector />
        <BalanceCard />
        <NewTransaction />
        <RecentTransactions />
        <PaymentSources />
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;