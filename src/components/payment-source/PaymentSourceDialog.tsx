import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";

const UPI_APPS = ["GPay", "PhonePe", "Cred", "IppoPay"];

type PaymentSourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: {
    id: string;
    name: string;
    type: string;
    amount: number;
    linked?: boolean;
    upiApps?: string[];
  };
};

export const PaymentSourceDialog = ({
  open,
  onOpenChange,
  source,
}: PaymentSourceDialogProps) => {
  const { editPaymentSource } = useFinance();
  const { toast } = useToast();
  const [name, setName] = useState(source?.name || "");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>(
    source?.upiApps || []
  );

  const handleUpiToggle = (upiApp: string) => {
    setSelectedUpiApps((prev) =>
      prev.includes(upiApp)
        ? prev.filter((app) => app !== upiApp)
        : [...prev, upiApp]
    );
  };

  const handleSave = () => {
    if (!source) return;

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }

    editPaymentSource({
      ...source,
      name: name.trim(),
      linked: selectedUpiApps.length > 0,
      upiApps: selectedUpiApps.length > 0 ? selectedUpiApps : undefined,
    });

    toast({
      title: "Success",
      description: "Payment source updated successfully",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment Source</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 rounded-[12px]"
            />
          </div>
          {source?.type === "Bank" && (
            <div className="space-y-2">
              <h3 className="font-medium">UPI Apps</h3>
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
          )}
          <Button onClick={handleSave} className="h-14 rounded-[12px]">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};