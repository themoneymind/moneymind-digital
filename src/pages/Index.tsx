import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Greeting } from "@/components/Greeting";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { DashboardTabs } from "@/components/DashboardTabs";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 pb-24 max-w-md mx-auto font-sans">
      <Header />
      <div className="mt-8 space-y-8">
        <div className="flex items-start justify-between px-6">
          <div className="flex flex-col items-start animate-fade-in">
            <Greeting />
            <MotivationalQuote />
          </div>
          <ProfilePicture />
        </div>
        <DashboardTabs />
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;