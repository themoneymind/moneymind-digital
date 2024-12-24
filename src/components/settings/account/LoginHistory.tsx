import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Monitor, Clock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LoginHistory = {
  id: string;
  device_info: string;
  ip_address: string;
  location: string;
  created_at: string;
};

export const LoginHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("login_history")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        setLoginHistory(data);
      } catch (error) {
        console.error("Error fetching login history:", error);
        toast({
          title: "Error",
          description: "Failed to load login history",
          variant: "destructive",
        });
      }
    };

    if (user?.id) {
      fetchLoginHistory();
    }
  }, [user?.id, toast]);

  return (
    <Card className="border-none shadow-none bg-white rounded-apple">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <CardTitle className="text-xl font-semibold">Recent Login Activity</CardTitle>
        </div>
        <CardDescription className="text-gray-500">
          Monitor your account access for security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loginHistory.map((login) => (
            <div
              key={login.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Monitor className="w-4 h-4 text-primary" />
                  <span className="font-medium">{login.device_info}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{login.location}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">{login.ip_address}</span>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(login.created_at), "MMM d, yyyy h:mm a")}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};