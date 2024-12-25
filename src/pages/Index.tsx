import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { DashboardTabs } from "@/components/DashboardTabs";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="relative flex flex-col min-h-screen max-w-md mx-auto font-sans">
      <Header />
      <main className="flex-1 bg-[#F5F5F7] dark:bg-gray-900 rounded-t-[28px] -mt-6 relative overflow-hidden">
        <div className="mt-6 space-y-6">
          <DashboardTabs />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;