import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BalanceCard } from "../BalanceCard";
import { useFinance } from "@/contexts/FinanceContext";

export const DashboardTabs = () => {
  const { paymentSources } = useFinance();
  
  const bankAccounts = paymentSources.filter(source => 
    source.type?.toLowerCase() === "bank"
  );
  
  const creditCards = paymentSources.filter(source => 
    source.type?.toLowerCase() === "credit"
  );

  return (
    <Tabs defaultValue="cards" className="w-full">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="cards" className="w-full">
          Cards
        </TabsTrigger>
        <TabsTrigger value="bank" className="w-full">
          Bank
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="cards" className="mt-0">
        <BalanceCard filterType="credit" />
      </TabsContent>
      
      <TabsContent value="bank" className="mt-0">
        <BalanceCard filterType="bank" />
      </TabsContent>
    </Tabs>
  );
};