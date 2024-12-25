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
    <>
      <Header />
      <div className="bg-[#F5F5F7] dark:bg-gray-900 rounded-t-[28px] -mt-1">
        <div className="mt-4 space-y-8">
          <DashboardTabs />
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Index;