import { useFinance } from "@/contexts/FinanceContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RecentTransactions } from "./RecentTransactions";
import { CreditCardList } from "./credit-card/CreditCardList";
import { AddCardButton } from "./credit-card/AddCardButton";

export const CreditCards = () => {
  const { paymentSources } = useFinance();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const creditCards = paymentSources.filter(source => source.type === "Credit Card");

  const handleAddCard = () => {
    navigate("/app/payment-source?type=credit");
  };

  return (
    <div className="space-y-6 overflow-x-hidden mb-8">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-base font-semibold">Credit Cards</h2>
        <AddCardButton onClick={handleAddCard} />
      </div>
      
      <div className="relative w-full">
        {creditCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground w-full">
            No credit cards added yet
          </div>
        ) : (
          <>
            <CreditCardList 
              creditCards={creditCards}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
            />

            {creditCards[activeIndex] && (
              <div className="px-6 mt-8">
                <RecentTransactions 
                  filterByType="Credit Card"
                  showViewAll={true}
                  sourceId={creditCards[activeIndex].id}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};