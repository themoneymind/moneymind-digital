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
    <div className="relative flex flex-col min-h-screen mx-auto font-sans overflow-hidden">
      <Header />
      <main className="flex-1 bg-[#F5F5F7] dark:bg-gray-900 rounded-t-[28px] -mt-6 relative pb-20 md:pb-0">
        <div className="px-4 md:px-6 lg:px-8 max-w-md mx-auto md:max-w-5xl">
          <div className="mt-6">
            <DashboardTabs />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;