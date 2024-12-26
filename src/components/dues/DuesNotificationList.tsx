import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Trash2, Check } from "lucide-react";

type Notification = {
  id: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
};

export const DuesNotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "due")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    setNotifications(data || []);
  };

  const handleEdit = (notification: Notification) => {
    setEditingId(notification.id);
    setEditMessage(notification.message);
  };

  const handleSave = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("notifications")
      .update({ message: editMessage })
      .eq("id", editingId);

    if (error) {
      toast.error("Failed to update notification");
      return;
    }

    toast.success("Notification updated successfully");
    setEditingId(null);
    fetchNotifications();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete notification");
      return;
    }

    toast.success("Notification deleted successfully");
    fetchNotifications();
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-[20px] p-6 space-y-4">
      <h2 className="text-base font-semibold">Due Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 bg-gray-50 rounded-lg space-y-2"
          >
            {editingId === notification.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <p className="text-sm flex-1">{notification.message}</p>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(notification)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500">
              {new Date(notification.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};