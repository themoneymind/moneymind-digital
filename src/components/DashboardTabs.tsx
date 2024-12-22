import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, Home, History } from "lucide-react";
import { PaymentSources } from "./PaymentSources";
import { CreditCards } from "./CreditCards";
import { RecentTransactions } from "./RecentTransactions";
import { BalanceCard } from "./BalanceCard";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-transparent">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Home className="w-4 h-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="credit-cards"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Cards
        </TabsTrigger>
        <TabsTrigger
          value="transactions"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <History className="w-4 h-4 mr-2" />
          History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <BalanceCard />
        <PaymentSources />
      </TabsContent>

      <TabsContent value="credit-cards" className="space-y-6">
        <CreditCards />
      </TabsContent>

      <TabsContent value="transactions" className="space-y-6">
        <RecentTransactions showViewAll />
      </TabsContent>
    </Tabs>
  );
};