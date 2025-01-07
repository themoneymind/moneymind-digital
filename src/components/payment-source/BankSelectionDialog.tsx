import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface BankSelectionDialogProps {
  selectedBank: string;
  onBankSelect: (bank: string) => void;
  showBankSearch: boolean;
  setShowBankSearch: (show: boolean) => void;
  banks: string[];
}

export const BankSelectionDialog = ({
  selectedBank,
  onBankSelect,
  showBankSearch,
  setShowBankSearch,
  banks,
}: BankSelectionDialogProps) => {
  return (
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
              {banks.map((bank) => (
                <CommandItem key={bank} onSelect={() => onBankSelect(bank)}>
                  {bank}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};