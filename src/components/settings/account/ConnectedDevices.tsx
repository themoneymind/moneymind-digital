import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Smartphone, Laptop } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ConnectedDevice = {
  id: string;
  device_name: string;
  device_type: string;
  last_active: string;
};

export const ConnectedDevices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data, error } = await supabase
          .from("connected_devices")
          .select("*")
          .eq("user_id", user?.id)
          .order("last_active", { ascending: false });

        if (error) throw error;
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast({
          title: "Error",
          description: "Failed to load connected devices",
          variant: "destructive",
        });
      }
    };

    if (user?.id) {
      fetchDevices();
    }
  }, [user?.id, toast]);

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

  return (
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
  );
};