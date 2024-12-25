import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaymentSources } from "./PaymentSources";
import { CreditCards } from "./CreditCards";
import { RecentTransactions } from "./RecentTransactions";
import { BalanceCard } from "./BalanceCard";
import { MonthSelector } from "./MonthSelector";
import { ScrollArea } from "./ui/scroll-area";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full h-[calc(100vh-180px)] flex flex-col">
      <div className="px-6 mb-2 mt-6">
        <TabsList className="w-full bg-transparent border-b border-gray-200">
          <TabsTrigger
            value="overview"
            className="flex-1 text-gray-500 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 text-sm h-[40px]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="credit-cards"
            className="flex-1 text-gray-500 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 text-sm h-[40px]"
          >
            Cards
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="flex-1 text-gray-500 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 text-sm h-[40px]"
          >
            Transactions
          </TabsTrigger>
        </TabsList>
      </div>

      <ScrollArea className="flex-1">
        <TabsContent value="overview" className="space-y-6 mx-6 mb-20">
          <MonthSelector />
          <BalanceCard />
          <PaymentSources />
        </TabsContent>

        <TabsContent value="credit-cards" className="space-y-6 mx-6 mb-20">
          <MonthSelector />
          <CreditCards />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Card Transactions</h3>
            <RecentTransactions showViewAll={false} filterByType="Credit Card" />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6 mx-6 mb-20">
          <RecentTransactions showViewAll />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};