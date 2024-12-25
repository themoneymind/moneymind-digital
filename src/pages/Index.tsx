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
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto font-sans">
      <Header />
      <div className="bg-[#F5F5F7] dark:bg-gray-900 rounded-t-[28px] -mt-6 relative z-10">
        <div className="mt-4 space-y-8">
          <DashboardTabs />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;