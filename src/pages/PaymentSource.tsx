import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

const UPI_APPS = ["GPay", "PhonePe", "Cred", "IppoPay"];
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

  const handleAddPaymentSource = () => {
    if (!selectedBank && selectedType === "bank") {
      toast({
        title: "Error",
        description: "Please select a bank",
        variant: "destructive",
      });
      return;
    }

    const upiDetails = [...selectedUpiApps];
    if (customUpi) {
      upiDetails.push(customUpi);
    }

    addPaymentSource({
      name: selectedBank || "Credit Card",
      type: selectedType === "bank" ? "Bank" : "Credit Card",
      amount: 0,
      linked: upiDetails.length > 0, // Convert to boolean
      upiApps: upiDetails.length > 0 ? upiDetails : undefined,
    });

    toast({
      title: "Success",
      description: "Payment source added successfully",
    });

    // Reset form
    setSelectedBank("");
    setCustomUpi("");
    setSelectedUpiApps([]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Link to="/dashboard" className="inline-block mb-8">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Add Payment Source</h1>
          <p className="text-muted-foreground">
            Add your bank accounts and credit cards
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            className={`flex-1 h-14 rounded-[12px] ${
              selectedType === "bank"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }`}
            onClick={() => setSelectedType("bank")}
          >
            Bank Account
          </Button>
          <Button
            variant="outline"
            className={`flex-1 h-14 rounded-[12px] ${
              selectedType === "credit"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }`}
            onClick={() => setSelectedType("credit")}
          >
            Credit Card
          </Button>
        </div>

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
                <div className="space-y-2">
                  <h3 className="font-medium">Select UPI Apps</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {UPI_APPS.map((app) => (
                      <div
                        key={app}
                        className="flex items-center space-x-2 bg-white p-4 rounded-[12px] border"
                      >
                        <Checkbox
                          id={app}
                          checked={selectedUpiApps.includes(app)}
                          onCheckedChange={() => handleUpiToggle(app)}
                        />
                        <label
                          htmlFor={app}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {app}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

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

        <Button
          className="w-full h-14 rounded-[12px]"
          onClick={handleAddPaymentSource}
        >
          Add Payment Source
        </Button>
      </div>
    </div>
  );
};