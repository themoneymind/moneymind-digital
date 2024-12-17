import { Header } from "@/components/Header";
import { MonthSelector } from "@/components/MonthSelector";
import { BalanceCard } from "@/components/BalanceCard";
import { NewTransaction } from "@/components/NewTransaction";
import { RecentTransactions } from "@/components/RecentTransactions";
import { PaymentSources } from "@/components/PaymentSources";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto font-sans">
      <Header />
      <div className="space-y-6 -mt-6 relative z-10">
        <div className="bg-white rounded-t-3xl px-6 pt-6 pb-4">
          <MonthSelector />
          <BalanceCard />
          <NewTransaction />
          <RecentTransactions />
          <PaymentSources />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;