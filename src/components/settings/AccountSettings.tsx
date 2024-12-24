import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2, Smartphone, Laptop } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type LoginHistory = {
  id: string;
  device_info: string;
  ip_address: string;
  location: string;
  created_at: string;
};

type ConnectedDevice = {
  id: string;
  device_name: string;
  device_type: string;
  last_active: string;
};

type Profile = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
};

export const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndHistory = async () => {
      try {
        const [profileData, historyData, devicesData] = await Promise.all([
          supabase
            .from("profiles")
            .select("first_name, last_name, phone_number")
            .eq("id", user?.id)
            .single(),
          supabase
            .from("login_history")
            .select("*")
            .eq("user_id", user?.id)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("connected_devices")
            .select("*")
            .eq("user_id", user?.id)
            .order("last_active", { ascending: false }),
        ]);

        if (profileData.error) throw profileData.error;
        if (historyData.error) throw historyData.error;
        if (devicesData.error) throw devicesData.error;

        setProfile({
          ...profileData.data,
          email: user?.email || "",
        });
        setLoginHistory(historyData.data);
        setDevices(devicesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load account information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchProfileAndHistory();
    }
  }, [user?.id, user?.email, toast]);

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from("connected_devices")
        .delete()
        .eq("id", deviceId);

      if (error) throw error;

      setDevices(devices.filter(device => device.id !== deviceId));
      toast({
        title: "Success",
        description: "Device removed successfully",
      });
    } catch (error) {
      console.error("Error removing device:", error);
      toast({
        title: "Error",
        description: "Failed to remove device",
        variant: "destructive",
      });
    }
  };

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

      <Card className="border-none shadow-none bg-white rounded-apple">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Connected Devices</CardTitle>
          <CardDescription className="text-gray-500">
            Manage your connected devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {device.device_type === "mobile" ? (
                    <Smartphone className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Laptop className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">{device.device_name}</p>
                    <p className="text-sm text-gray-500">
                      Last active: {format(new Date(device.last_active), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDevice(device.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistory.map((login) => (
                <TableRow key={login.id}>
                  <TableCell>
                    {format(new Date(login.created_at), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>{login.device_info}</TableCell>
                  <TableCell>{login.location}</TableCell>
                  <TableCell>{login.ip_address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};