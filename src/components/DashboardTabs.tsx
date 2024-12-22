import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaymentSources } from "./PaymentSources";
import { CreditCards } from "./CreditCards";
import { RecentTransactions } from "./RecentTransactions";
import { BalanceCard } from "./BalanceCard";
import { MonthSelector } from "./MonthSelector";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full px-6">
      <div className="mb-6">
        <TabsList className="w-full grid grid-cols-3 bg-white rounded-[20px] p-1.5">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300 text-sm py-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="credit-cards"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300 text-sm py-2"
          >
            Cards
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[14px] transition-all duration-300 text-sm py-2"
          >
            Transactions
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-6">
        <MonthSelector />
        <BalanceCard />
        <PaymentSources />
      </TabsContent>

      <TabsContent value="credit-cards" className="space-y-6">
        <MonthSelector />
        <CreditCards />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Card Transactions</h3>
          <RecentTransactions showViewAll={false} filterByType="Credit Card" />
        </div>
      </TabsContent>

      <TabsContent value="transactions" className="space-y-6">
        <RecentTransactions showViewAll />
      </TabsContent>
    </Tabs>
  );
};