import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { Laptop, Smartphone, Trash2 } from "lucide-react";

type ConnectedDevice = {
  id: string;
  device_name: string;
  device_type: string;
  last_active: string;
};

type LoginHistory = {
  id: string;
  ip_address: string;
  device_info: string;
  location: string;
  created_at: string;
};

export const AdvancedSecuritySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDevicesAndHistory();
  }, [user]);

  const fetchDevicesAndHistory = async () => {
    try {
      const [devicesResponse, historyResponse] = await Promise.all([
        supabase
          .from("connected_devices")
          .select("*")
          .eq("user_id", user?.id)
          .order("last_active", { ascending: false }),
        supabase
          .from("login_history")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (devicesResponse.error) throw devicesResponse.error;
      if (historyResponse.error) throw historyResponse.error;

      setDevices(devicesResponse.data);
      setLoginHistory(historyResponse.data);
    } catch (error) {
      console.error("Error fetching security data:", error);
      toast({
        title: "Error",
        description: "Failed to load security information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
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
                      Last active: {formatDate(device.last_active)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDevice(device.id)}
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
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
            Review your recent account access
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
                  <TableCell>{formatDate(login.created_at)}</TableCell>
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