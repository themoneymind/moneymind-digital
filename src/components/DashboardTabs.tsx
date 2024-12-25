import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaymentSources } from "./PaymentSources";
import { CreditCards } from "./CreditCards";
import { RecentTransactions } from "./RecentTransactions";
import { BalanceCard } from "./BalanceCard";
import { MonthSelector } from "./MonthSelector";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="px-6">
        <TabsList className="w-full bg-transparent border-b border-gray-200">
          <TabsTrigger
            value="overview"
            className="flex-1 text-gray-500 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 text-sm h-[40px] hover:text-primary"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="credit-cards"
            className="flex-1 text-gray-500 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 text-sm h-[40px] hover:text-primary"
          >
            Cards
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="flex-1 text-gray-500 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 text-sm h-[40px] hover:text-primary"
          >
            Transactions
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-4 mx-6 mt-6">
        <MonthSelector />
        <BalanceCard />
        <PaymentSources />
      </TabsContent>

      <TabsContent value="credit-cards" className="space-y-4 mx-6 mt-6">
        <MonthSelector />
        <CreditCards />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Card Transactions</h3>
          <RecentTransactions showViewAll={false} filterByType="Credit Card" />
        </div>
      </TabsContent>

      <TabsContent value="transactions" className="space-y-4 mx-6 mt-6">
        <RecentTransactions showViewAll />
      </TabsContent>
    </Tabs>
  );
};