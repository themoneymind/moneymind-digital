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

export const DuesForm = () => {
  const { getFormattedPaymentSources } = useFinance();
  const [type, setType] = useState<"given" | "received">("given");
  const [amount, setAmount] = useState("");
  const [personName, setPersonName] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [upiId, setUpiId] = useState("");

  const formattedSources = getFormattedPaymentSources();

  const getDynamicMessage = () => {
    if (!amount || !personName) return "";
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount));

    const message = type === "given"
      ? `You'll receive ${formattedAmount} from ${personName}`
      : `You'll pay ${formattedAmount} to ${personName}`;

    const note = type === "given"
      ? "This will be recorded as 'Due Given' in your transactions"
      : "This will be recorded as 'Due Received' in your transactions";

    return { message, note };
  };

  const handleSubmit = () => {
    // Will implement the submission logic later
    console.log({
      type,
      amount,
      personName,
      dueDate,
      source,
      description: `Due ${type === "given" ? "Given" : "Received"}: ${description || "No description"}`,
      upiId,
    });
  };

  const { message, note } = getDynamicMessage();

  return (
    <div className="p-6 mx-4 bg-white rounded-[20px]">
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

        {(amount || personName) && (
          <div className="p-4 bg-blue-50 rounded-[12px] space-y-2">
            <p className="text-sm text-blue-700">{message}</p>
            {upiId && (
              <p className="text-xs text-blue-600">
                {type === "given" ? "Their" : "Your"} UPI/Phone: {upiId}
              </p>
            )}
            <p className="text-xs text-blue-500 italic">{note}</p>
          </div>
        )}

        <Button
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px]"
          onClick={handleSubmit}
        >
          Add Due
        </Button>
      </div>
    </div>
  );
};