import { ArrowDown, ArrowUp, CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { startOfMonth, endOfMonth, isWithinInterval, isBefore } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const CreditCardStack = () => {
  const { paymentSources, transactions, currentMonth } = useFinance();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter credit card sources
  const creditCards = paymentSources.filter(source => source.type === "credit");
  
  console.log("Found credit cards:", creditCards);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Calculate credit usage for each card
  const creditCardUsage = creditCards.map(card => {
    // Get transactions for this card up to current month
    const cardTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const isCardTransaction = t.source === card.id;
      
      // For historical view, only include transactions up to selected month
      return isCardTransaction && isBefore(transactionDate, endOfMonth(currentMonth));
    });

    // Calculate monthly transactions
    const monthlyTransactions = cardTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return isWithinInterval(transactionDate, {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
      });
    });

    // Calculate total spent and payments
    const totalSpent = monthlyTransactions
      .filter(t => t.type === "expense" && t.category !== "Credit Card Bill")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalPayments = monthlyTransactions
      .filter(t => t.category === "Credit Card Bill")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Calculate available credit
    const creditLimit = Number(card.amount);
    const usedCredit = totalSpent - totalPayments;
    const availableCredit = creditLimit - usedCredit;

    return {
      ...card,
      totalSpent,
      totalPayments,
      usedCredit,
      availableCredit,
      utilizationRate: (usedCredit / creditLimit) * 100
    };
  });

  if (creditCards.length === 0) {
    return null;
  }

  return (
    <div className="p-6 mx-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Credit Cards</h2>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {creditCardUsage.map((card, index) => (
              <div
                key={card.id}
                className="flex-[0_0_100%] min-w-0 relative pl-2 pr-4"
                style={{
                  transform: `scale(${selectedIndex === index ? 1 : 0.9})`,
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <div className="p-6 bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to rounded-apple text-white shadow-lg transform transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium opacity-90">{card.name}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm opacity-75">Credit Limit</p>
                      <p className="text-2xl font-bold">{formatCurrency(card.amount)}</p>
                    </div>

                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/40 transition-all"
                        style={{ width: `${Math.min(card.utilizationRate, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-red-400/20 rounded-full">
                            <ArrowUp className="w-3 h-3 text-red-400" />
                          </div>
                          <p className="text-sm opacity-75">Used</p>
                        </div>
                        <p className="text-lg font-semibold mt-1">
                          {formatCurrency(card.usedCredit)}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-green-400/20 rounded-full">
                            <ArrowDown className="w-3 h-3 text-green-400" />
                          </div>
                          <p className="text-sm opacity-75">Available</p>
                        </div>
                        <p className="text-lg font-semibold mt-1">
                          {formatCurrency(card.availableCredit)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {creditCards.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md ${
                !prevBtnEnabled && 'opacity-50 cursor-not-allowed'
              }`}
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md ${
                !nextBtnEnabled && 'opacity-50 cursor-not-allowed'
              }`}
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {creditCards.length > 1 && (
        <div className="flex justify-center gap-1 mt-4">
          {creditCards.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedIndex === index ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};