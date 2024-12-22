import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, Home, History } from "lucide-react";
import { PaymentSources } from "./PaymentSources";
import { CreditCards } from "./CreditCards";
import { RecentTransactions } from "./RecentTransactions";
import { BalanceCard } from "./BalanceCard";
import { MonthSelector } from "./MonthSelector";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-white rounded-[20px] p-2 shadow-sm border border-gray-100 mb-6">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300"
        >
          <Home className="w-4 h-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="credit-cards"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Cards
        </TabsTrigger>
        <TabsTrigger
          value="transactions"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300"
        >
          <History className="w-4 h-4 mr-2" />
          Transactions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <MonthSelector />
        <BalanceCard />
        <PaymentSources />
      </TabsContent>

      <TabsContent value="credit-cards" className="space-y-6">
        <MonthSelector />
        <CreditCards />
        <div className="px-6">
          <h3 className="text-lg font-semibold mb-4">Card Transactions</h3>
          <RecentTransactions showViewAll={false} filterByType="Credit Card" />
        </div>
      </TabsContent>

      <TabsContent value="transactions" className="space-y-6">
        <RecentTransactions showViewAll />
      </TabsContent>
    </Tabs>
  );
};