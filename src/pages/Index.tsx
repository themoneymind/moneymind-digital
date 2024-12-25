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
      <div className="h-6 bg-[#F5F5F7] dark:bg-gray-900 relative -mt-6 rounded-t-[28px]" />
      <div className="bg-[#F5F5F7] dark:bg-gray-900">
        <div className="mt-4 space-y-8">
          <DashboardTabs />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;