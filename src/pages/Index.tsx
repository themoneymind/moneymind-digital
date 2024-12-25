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
    <div className="flex flex-col min-h-screen max-w-md mx-auto font-sans">
      <Header />
      <main className="flex-1 bg-[#F5F5F7] dark:bg-gray-900 rounded-t-[28px] -mt-6 relative overflow-y-scroll pb-20">
        <div className="mt-4 space-y-8">
          <DashboardTabs />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;