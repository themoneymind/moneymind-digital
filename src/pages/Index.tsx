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
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-gray-900">
      <Header />
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-t-[28px] -mt-6 p-4 space-y-8">
          <DashboardTabs />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;