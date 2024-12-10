import { useAuth } from "@/contexts/AuthContext";
import { Wave } from "lucide-react";

export const Greeting = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || 'there';

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="pl-2">
      <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        {getTimeBasedGreeting()}, {firstName}
        <Wave className="h-4 w-4 text-primary animate-bounce" />
      </h1>
    </div>
  );
};