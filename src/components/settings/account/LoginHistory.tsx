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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  );
};