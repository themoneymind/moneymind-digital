import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceNote } from "@/components/payment-source/PaymentSourceNote";
import { PaymentSourceTypeSelector } from "@/components/payment-source/PaymentSourceTypeSelector";
import { UpiAppsSelector } from "@/components/payment-source/UpiAppsSelector";

const INDIAN_BANKS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Yes Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "IndusInd Bank",
];

export const PaymentSource = () => {
  const { addPaymentSource } = useFinance();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"bank" | "credit">("bank");
  const [selectedBank, setSelectedBank] = useState("");
  const [customUpi, setCustomUpi] = useState("");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>([]);
  const [showBankSearch, setShowBankSearch] = useState(false);

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
    setShowBankSearch(false);
  };

  const handleUpiToggle = (upiApp: string) => {
    setSelectedUpiApps((prev) =>
      prev.includes(upiApp)
        ? prev.filter((app) => app !== upiApp)
        : [...prev, upiApp]
    );
  };

  const handleComplete = async () => {
    if (!selectedBank && selectedType === "bank") {
      toast({
        title: "Error",
        description: "Please select a bank",
        variant: "destructive",
      });
      return;
    }

    const upiDetails = selectedUpiApps.slice();
    if (customUpi.trim()) {
      upiDetails.push(customUpi.trim());
    }

    try {
      const newSource = {
        name: selectedBank || "Credit Card",
        type: selectedType === "bank" ? "Bank" : "Credit Card",
        amount: 0,
        linked: upiDetails.length > 0,
        upi_apps: upiDetails.length > 0 ? upiDetails : undefined,
      };

      await addPaymentSource(newSource);
      localStorage.removeItem("isFirstTimeUser");

      toast({
        title: "Success",
        description: "Payment source added successfully",
      });

      navigate("/app");
    } catch (error) {
      console.error("Error adding payment source:", error);
      toast({
        title: "Error",
        description: "Failed to add payment source",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Add Payment Source</h1>
          <p className="text-muted-foreground">
            Add your bank accounts and credit cards
          </p>
        </div>

        <PaymentSourceNote />

        <PaymentSourceTypeSelector
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        {selectedType === "bank" && (
          <div className="space-y-4">
            <Dialog open={showBankSearch} onOpenChange={setShowBankSearch}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-[12px] justify-between bg-white"
                >
                  {selectedBank || "Select Bank"}
                  <Search className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Select Bank</DialogTitle>
                </DialogHeader>
                <Command className="rounded-lg border shadow-md">
                  <CommandInput placeholder="Search banks..." />
                  <CommandList>
                    <CommandEmpty>No banks found.</CommandEmpty>
                    <CommandGroup>
                      {INDIAN_BANKS.map((bank) => (
                        <CommandItem
                          key={bank}
                          onSelect={() => handleBankSelect(bank)}
                        >
                          {bank}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DialogContent>
            </Dialog>

            {selectedBank && (
              <div className="space-y-4">
                <UpiAppsSelector
                  selectedUpiApps={selectedUpiApps}
                  onUpiToggle={handleUpiToggle}
                />

                <div className="space-y-2">
                  <h3 className="font-medium">Add Custom UPI App</h3>
                  <Input
                    placeholder="Enter UPI app name"
                    value={customUpi}
                    onChange={(e) => setCustomUpi(e.target.value)}
                    className="h-14 rounded-[12px] bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {selectedType === "credit" && (
          <Input
            placeholder="Enter credit card name"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="h-14 rounded-[12px] bg-white"
          />
        )}

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
          <Button
            className="w-full h-14 rounded-[12px]"
            onClick={handleComplete}
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};