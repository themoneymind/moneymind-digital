import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type LoginHistory = {
  id: string;
  device_info: string;
  ip_address: string;
  location: string;
  created_at: string;
};

type Profile = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
};

export const AccountSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndHistory = async () => {
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone_number")
          .eq("id", user?.id)
          .single();

        if (profileError) throw profileError;

        // Fetch login history
        const { data: historyData, error: historyError } = await supabase
          .from("login_history")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (historyError) throw historyError;

        setProfile({
          ...profileData,
          email: user?.email || "",
        });
        setLoginHistory(historyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchProfileAndHistory();
    }
  }, [user?.id, user?.email]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-white rounded-apple">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Account Details</CardTitle>
          <CardDescription className="text-gray-500">
            Your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input value={profile?.first_name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input value={profile?.last_name || ""} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input value={profile?.email || ""} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <Input value={profile?.phone_number || ""} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-white rounded-apple">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Login Activity</CardTitle>
          <CardDescription className="text-gray-500">
            Your recent account access history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loginHistory.map((login) => (
              <div
                key={login.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{login.device_info}</p>
                  <p className="text-xs text-gray-500">
                    {login.ip_address} • {login.location}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(login.created_at), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};