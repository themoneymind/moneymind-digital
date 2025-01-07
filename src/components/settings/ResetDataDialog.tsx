import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export const ResetDataDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();

  const handleReset = async () => {
    if (!user) return;
    if (confirmText.toLowerCase() !== "reset") {
      toast.error("Please type 'reset' to confirm");
      return;
    }

    try {
      setIsResetting(true);
      console.log("Starting data reset for user:", user.id);

      // Delete all user's transactions
      const { error: transactionsError } = await supabase
        .from("transactions")
        .delete()
        .eq("user_id", user.id);

      if (transactionsError) throw transactionsError;

      // Delete all user's payment sources
      const { error: sourcesError } = await supabase
        .from("payment_sources")
        .delete()
        .eq("user_id", user.id);

      if (sourcesError) throw sourcesError;

      // Delete all user's notifications
      const { error: notificationsError } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (notificationsError) throw notificationsError;

      toast.success("All data has been reset successfully");
      setIsOpen(false);
      setConfirmText("");
    } catch (error) {
      console.error("Error resetting data:", error);
      toast.error("Failed to reset data. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full rounded-lg h-11">
          <Trash2 className="w-4 h-4 mr-2" />
          Reset All Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-apple">
        <DialogHeader>
          <DialogTitle>Reset All Data</DialogTitle>
          <DialogDescription className="pt-4">
            This action will permanently delete all your data, including:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All transactions</li>
              <li>All payment sources</li>
              <li>All notifications</li>
            </ul>
            <div className="mt-4 text-red-500 font-semibold">
              This action cannot be undone!
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-sm text-gray-600 block mb-2">
            Type "reset" to confirm:
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="reset"
            className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isResetting}
            className="border-gray-200 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={isResetting || confirmText.toLowerCase() !== "reset"}
            className="rounded-lg"
          >
            {isResetting ? "Resetting..." : "Reset All Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};