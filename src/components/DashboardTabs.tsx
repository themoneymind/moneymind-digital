import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaymentSources } from "./PaymentSources";
import { CreditCards } from "./CreditCards";
import { RecentTransactions } from "./RecentTransactions";
import { BalanceCard } from "./BalanceCard";
import { MonthSelector } from "./MonthSelector";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full animate-fade-in">
      <div className="sticky top-0 z-10 px-6 mb-8">
        <TabsList className="w-full bg-white/50 backdrop-blur-sm rounded-[20px] p-2 h-[56px] shadow-sm border border-white/20">
          <TabsTrigger
            value="overview"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300 text-sm h-[44px]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="credit-cards"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300 text-sm h-[44px]"
          >
            Cards
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300 text-sm h-[44px]"
          >
            Transactions
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-8 mx-6 animate-scale-in">
        <MonthSelector />
        <BalanceCard />
        <PaymentSources />
      </TabsContent>

      <TabsContent value="credit-cards" className="space-y-8 mx-6 animate-scale-in">
        <MonthSelector />
        <CreditCards />
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Card Transactions</h3>
          <RecentTransactions showViewAll={false} filterByType="Credit Card" />
        </div>
      </TabsContent>

      <TabsContent value="transactions" className="space-y-8 mx-6 animate-scale-in">
        <RecentTransactions showViewAll />
      </TabsContent>
    </Tabs>
  );
};