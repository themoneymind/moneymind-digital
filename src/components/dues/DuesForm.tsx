import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DuesTypeSelector } from "./DuesTypeSelector";
import { PaymentSourceSelector } from "../transaction/PaymentSourceSelector";
import { useFinance } from "@/contexts/FinanceContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DuesMessage } from "./DuesMessage";
import { toast } from "sonner";

export const DuesForm = () => {
  const { getFormattedPaymentSources, addTransaction } = useFinance();
  const [type, setType] = useState<"given" | "received">("given");
  const [amount, setAmount] = useState("");
  const [personName, setPersonName] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedSources = getFormattedPaymentSources();

  const handleSubmit = async () => {
    if (!amount || !personName || !source) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const dueDescription = `Due ${type === "given" ? "Given" : "Received"}: ${description || "No description"}`;
      const dueNote = `Person: ${personName}${upiId ? `, UPI: ${upiId}` : ''}${dueDate ? `, Due Date: ${format(dueDate, 'PP')}` : ''}`;

      await addTransaction({
        type: type === "given" ? "expense" : "income",
        amount: Number(amount),
        category: "Dues",
        source,
        description: dueDescription,
        reference_type: "due",
        reference_id: crypto.randomUUID(),
      });

      // Reset form after successful submission
      setAmount("");
      setPersonName("");
      setDueDate(undefined);
      setSource("");
      setDescription("");
      setUpiId("");
      
      toast.success("Due added successfully");
    } catch (error) {
      console.error("Error adding due:", error);
      toast.error("Failed to add due");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNotificationPreview = () => {
    if (!amount || !personName) return null;

    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount));

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Example: due in 7 days

    return {
      title: `Due ${type === "given" ? "Reminder" : "Payment"}`,
      message: type === "given"
        ? `Reminder: ${personName} needs to pay you ${formattedAmount}`
        : `Payment Due: You need to pay ${formattedAmount} to ${personName}`,
      dueDate: dueDate.toLocaleDateString()
    };
  };

  const preview = getNotificationPreview();

  return (
    <div className="p-6 bg-white rounded-[20px]">
      <h2 className="mb-6 text-base font-semibold">New Due</h2>
      <div className="space-y-4">
        <DuesTypeSelector type={type} onTypeChange={setType} />
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <Input
            type="number"
            placeholder="0"
            className="text-2xl pl-8 h-14 border-gray-200 rounded-[12px]"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Input
          placeholder="Person/Group Name"
          className="h-14 border-gray-200 rounded-[12px]"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-14 justify-start text-left font-normal border-gray-200 rounded-[12px]",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Select due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <PaymentSourceSelector
          source={source}
          onSourceChange={setSource}
          formattedSources={formattedSources}
        />

        <Input
          placeholder="UPI ID or Phone Number"
          className="h-14 border-gray-200 rounded-[12px]"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />

        <Input
          placeholder="Description (Optional)"
          className="h-14 border-gray-200 rounded-[12px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <DuesMessage
          type={type}
          amount={amount}
          personName={personName}
          upiId={upiId}
        />

        {preview && (
          <div className="p-4 bg-gray-50 rounded-[12px] space-y-2">
            <p className="text-sm font-medium text-gray-900">{preview.title}</p>
            <p className="text-sm text-gray-600">{preview.message}</p>
            <p className="text-xs text-gray-500">Will be sent on: {preview.dueDate}</p>
          </div>
        )}

        <Button
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px]"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Due..." : "Add Due"}
        </Button>
      </div>
    </div>
  );
};
