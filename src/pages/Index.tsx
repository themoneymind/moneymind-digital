import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { DashboardTabs } from "@/components/DashboardTabs";
import { FinanceProvider } from "@/contexts/FinanceContext";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <FinanceProvider>
      <div className="relative flex flex-col min-h-screen max-w-md mx-auto font-sans overflow-x-hidden">
        <Header />
        <main className="flex-1 bg-[#F5F5F7] dark:bg-gray-900 rounded-t-[28px] -mt-6 relative pb-20 overflow-x-hidden">
          <div className="mt-6">
            <DashboardTabs />
          </div>
        </main>
        <BottomNav />
      </div>
    </FinanceProvider>
  );
};

export default Index;