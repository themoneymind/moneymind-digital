import { Header } from "@/components/Header";
import { MonthSelector } from "@/components/MonthSelector";
import { BalanceCard } from "@/components/BalanceCard";
import { NewTransaction } from "@/components/NewTransaction";
import { RecentTransactions } from "@/components/RecentTransactions";
import { PaymentSources } from "@/components/PaymentSources";
import { BottomNav } from "@/components/BottomNav";
import { ProfilePicture } from "@/components/ProfilePicture";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto font-sans">
      <Header />
      <div className="space-y-6 py-4">
        <div className="flex items-center gap-3 px-4">
          <ProfilePicture />
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-semibold">Elumalai Ravi</h1>
            <p className="text-sm text-gray-500">Building wealth together</p>
          </div>
        </div>
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