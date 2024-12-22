import { useFinance } from "@/contexts/FinanceContext";
import { CreditCardItem } from "./credit-card/CreditCardItem";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
          className="rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </div>
      
      <div className="px-6 space-y-4">
        {creditCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No credit cards added yet
          </div>
        ) : (
          creditCards.map((card) => (
            <CreditCardItem key={card.id} card={card} />
          ))
        )}
      </div>
    </div>
  );
};