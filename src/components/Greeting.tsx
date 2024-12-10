import { useAuth } from "@/contexts/AuthContext";

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
    <div className="pl-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        {getTimeBasedGreeting()}, {firstName}
      </h1>
    </div>
  );
};