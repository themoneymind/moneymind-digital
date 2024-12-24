import { useState, useEffect } from "react";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AccountSettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
  });

  // Load user profile data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone_number, date_of_birth")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Format date to YYYY-MM-DD for input type="date"
        const formattedDate = data.date_of_birth 
          ? new Date(data.date_of_birth).toISOString().split('T')[0]
          : "";

        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone_number: data.phone_number || "",
          date_of_birth: formattedDate,
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      }
    };

    loadUserProfile();
  }, [user, toast]);

  const handleSave = async () => {
    if (!user) return;
    setIsPasswordDialogOpen(true);
  };

  const confirmChanges = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password,
      });

      if (authError) throw authError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Account settings updated successfully",
      });
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: "Error",
        description: "Failed to update account settings. Please check your password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-gray-900">
      <SettingsHeader title="Account Settings" />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-apple p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <Input
              value={formData.first_name}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <Input
              value={formData.last_name}
              onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth
            </label>
            <Input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              onClick={confirmChanges} 
              disabled={isLoading || !password}
              className="w-full"
            >
              {isLoading ? "Confirming..." : "Confirm Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};