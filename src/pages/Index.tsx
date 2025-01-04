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
    <div className="relative flex flex-col min-h-screen mx-auto font-sans overflow-hidden md:max-w-none">
      <Header />
      <main className="flex-1 bg-[#F5F5F7] dark:bg-gray-900 rounded-t-[28px] -mt-6 relative pb-20 md:pb-0 md:px-6 lg:px-8">
        <div className="mt-6 max-w-[1400px] mx-auto">
          <DashboardTabs />
        </div>
      </main>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;