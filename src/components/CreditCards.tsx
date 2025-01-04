import { useFinance } from "@/contexts/FinanceContext";
import { CreditCardItem } from "./credit-card/CreditCardItem";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CreditCards = () => {
  const { paymentSources } = useFinance();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const creditCards = paymentSources.filter(source => source.type === "Credit Card");

  const handleAddCard = () => {
    navigate("/app/payment-source?type=credit");
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">Credit Cards</h2>
        <Button
          onClick={handleAddCard}
          className="bg-primary hover:bg-primary/90 transition-colors rounded-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Card
        </Button>
      </div>
      
      <div className="relative w-full">
        {creditCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground w-full">
            No credit cards added yet
          </div>
        ) : (
          <>
            <div className="px-6">
              <CreditCardItem card={creditCards[activeIndex]} />
            </div>
            
            {creditCards.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {creditCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? "bg-primary w-4" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};