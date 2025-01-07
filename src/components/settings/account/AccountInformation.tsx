import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
};

export const AccountInformation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone_number")
          .eq("id", user?.id)
          .single();

        if (error) throw error;

        setProfile({
          ...profileData,
          email: user?.email || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load account information",
          variant: "destructive",
        });
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id, user?.email, toast]);

  return (
    <Card className="border-none shadow-none bg-white rounded-apple">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Account Information</CardTitle>
        <CardDescription className="text-gray-500">
          Your personal account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <Input value={profile?.first_name || ""} readOnly className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <Input value={profile?.last_name || ""} readOnly className="bg-gray-50" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input value={profile?.email || ""} readOnly className="bg-gray-50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <Input value={profile?.phone_number || ""} readOnly className="bg-gray-50" />
        </div>
      </CardContent>
    </Card>
  );
};