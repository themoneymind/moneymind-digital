import { useFinance } from "@/contexts/FinanceContext";
import { CreditCardItem } from "./credit-card/CreditCardItem";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export const CreditCards = () => {
  const { paymentSources } = useFinance();
  const navigate = useNavigate();
  
  const creditCards = paymentSources.filter(source => source.type === "Credit Card");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">Credit Cards</h2>
        <Button
          size="sm"
          onClick={() => navigate("/app/payment-source")}
          className="rounded-full bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 px-6 pb-4">
          {creditCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground w-full">
              No credit cards added yet
            </div>
          ) : (
            creditCards.map((card) => (
              <div key={card.id} className="min-w-[320px]">
                <CreditCardItem card={card} />
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};