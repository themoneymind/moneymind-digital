import { Header } from "@/components/Header";
import { MonthSelector } from "@/components/MonthSelector";
import { NewTransaction } from "@/components/NewTransaction";
import { RecentTransactions } from "@/components/RecentTransactions";
import { PaymentSources } from "@/components/PaymentSources";
import { BottomNav } from "@/components/BottomNav";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Greeting } from "@/components/Greeting";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto font-sans">
      <Header />
      <div className="space-y-6 py-4">
        <div className="flex items-center justify-between px-6">
          <div className="flex flex-col items-start">
            <Greeting />
            <MotivationalQuote />
          </div>
          <ProfilePicture />
        </div>
        <MonthSelector />
        <DashboardTabs />
        <NewTransaction />
        <RecentTransactions />
        <PaymentSources />
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;