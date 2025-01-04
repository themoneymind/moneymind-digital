import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaymentSources } from "./PaymentSources";
import { CreditCards } from "./CreditCards";
import { RecentTransactions } from "./RecentTransactions";
import { BalanceCard } from "./BalanceCard";
import { MonthSelector } from "./MonthSelector";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full overflow-x-hidden">
      <TabsList className="w-full bg-transparent border-b border-gray-200 px-6">
        <TabsTrigger
          value="overview"
          className="flex-1 text-gray-500 data-[state=active]:text-[#7F3DFF] data-[state=active]:border-b-2 data-[state=active]:border-[#7F3DFF] border-0 bg-transparent rounded-none transition-all duration-300 text-sm h-[40px] hover:text-[#7F3DFF]"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="credit-cards"
          className="flex-1 text-gray-500 data-[state=active]:text-[#7F3DFF] data-[state=active]:border-b-2 data-[state=active]:border-[#7F3DFF] border-0 bg-transparent rounded-none transition-all duration-300 text-sm h-[40px] hover:text-[#7F3DFF]"
        >
          Cards
        </TabsTrigger>
        <TabsTrigger
          value="transactions"
          className="flex-1 text-gray-500 data-[state=active]:text-[#7F3DFF] data-[state=active]:border-b-2 data-[state=active]:border-[#7F3DFF] border-0 bg-transparent rounded-none transition-all duration-300 text-sm h-[40px] hover:text-[#7F3DFF]"
        >
          Transactions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <div className="px-6">
          <MonthSelector />
          <BalanceCard />
          <PaymentSources />
        </div>
      </TabsContent>

      <TabsContent value="credit-cards" className="mt-6">
        <div className="px-6">
          <MonthSelector />
        </div>
        <CreditCards />
        <div className="px-6">
          <RecentTransactions showViewAll={false} filterByType="Credit Card" />
        </div>
      </TabsContent>

      <TabsContent value="transactions" className="mt-6">
        <div className="px-6">
          <MonthSelector />
          <RecentTransactions />
        </div>
      </TabsContent>
    </Tabs>
  );
};