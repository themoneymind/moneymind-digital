import { Header } from "@/components/Header";
import { MonthSelector } from "@/components/MonthSelector";
import { BalanceCard } from "@/components/BalanceCard";
import { NewTransaction } from "@/components/NewTransaction";
import { RecentTransactions } from "@/components/RecentTransactions";
import { PaymentSources } from "@/components/PaymentSources";
import { BottomNav } from "@/components/BottomNav";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const quotes = [
  "Building wealth together",
  "Smart money moves",
  "Financial freedom awaits",
  "Track every penny"
];

const Index = () => {
  const { user } = useAuth();
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => {
        const currentIndex = quotes.indexOf(prev);
        return quotes[(currentIndex + 1) % quotes.length];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto font-sans">
      <Header />
      <div className="space-y-6 py-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-semibold">Elumalai Ravi 👋</h1>
            <p className="text-sm text-gray-500">{currentQuote}</p>
          </div>
          <ProfilePicture />
        </div>
        <MonthSelector />
        <BalanceCard />
        <NewTransaction />
        <RecentTransactions />
        <PaymentSources />
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;