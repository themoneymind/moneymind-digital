import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

export const PaymentSource = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <Link to="/" className="inline-block mb-8">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Payment Sources</h1>
          <p className="text-muted-foreground">
            Add your payment sources to track expenses
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-14 rounded-[12px] justify-start gap-3"
          >
            <Plus className="h-5 w-5" />
            Add Bank Account
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 rounded-[12px] justify-start gap-3"
          >
            <Plus className="h-5 w-5" />
            Add Credit Card
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 rounded-[12px] justify-start gap-3"
          >
            <Plus className="h-5 w-5" />
            Add Digital Wallet
          </Button>
        </div>

        <Button className="w-full h-14 rounded-[12px] text-base">
          Continue
        </Button>
      </div>
    </div>
  );
};