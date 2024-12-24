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
import { Shield, Download, Lock } from "lucide-react";

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
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <CardTitle className="text-xl font-semibold">Privacy Settings</CardTitle>
        </div>
        <CardDescription className="text-gray-500">
          Control how your data is handled and used
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Our Commitment to Your Privacy</h3>
            <p className="text-sm text-blue-600">
              We prioritize the security and privacy of your financial data. All information is encrypted,
              stored securely, and never shared without your explicit consent. We comply with industry
              standards to ensure your data remains protected.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Anonymous Data Sharing</label>
                <p className="text-sm text-gray-500">
                  Allow sharing of anonymized data to improve our services and features
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
                className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export My Data
              </Button>
            </div>

            <div className="p-4 border border-gray-100 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium">Data Protection</h4>
              </div>
              <p className="text-sm text-gray-500">
                Your financial data is encrypted and stored securely. We never share your personal
                information with third parties without your explicit consent. You can export or delete
                your data at any time.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};