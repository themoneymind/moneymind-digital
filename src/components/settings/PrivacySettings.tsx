import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PrivacySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const handlePrivacyUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          data_sharing: dataSharing,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Privacy settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id);

      if (profileError || transactionsError) throw profileError || transactionsError;

      const exportData = {
        profile: profileData,
        transactions: transactionsData,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = 'my-finance-data.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-none shadow-none bg-white rounded-apple">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Privacy Settings</CardTitle>
        <CardDescription className="text-gray-500">
          Manage your data and privacy preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Data Sharing</label>
            <p className="text-sm text-gray-500">
              Allow anonymous data sharing to improve our services
            </p>
          </div>
          <Switch
            checked={dataSharing}
            onCheckedChange={setDataSharing}
          />
        </div>

        <div className="space-y-4">
          <Button
            onClick={handlePrivacyUpdate}
            disabled={isUpdating}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-11"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            onClick={handleExportData}
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11"
          >
            Export My Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};