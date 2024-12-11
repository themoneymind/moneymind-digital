import { MoreVertical, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type PaymentSourceActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  isAlertOpen: boolean;
  setIsAlertOpen: (open: boolean) => void;
};

export const PaymentSourceActions = ({
  onEdit,
  onDelete,
  isAlertOpen,
  setIsAlertOpen,
}: PaymentSourceActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-gray-100"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-white border border-gray-200 shadow-lg rounded-[12px] p-1">
        <DropdownMenuItem 
          onClick={onEdit}
          className="gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </DropdownMenuItem>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="gap-2 text-sm text-red-500 focus:text-red-500 cursor-pointer hover:bg-gray-50 rounded-[8px]"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                payment source and remove it from all transactions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};