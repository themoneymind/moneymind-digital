import { useAuth } from "@/contexts/AuthContext";

export const Greeting = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || 'there';

  const getGreeting = () => {
    const greetings = ["Hi", "Hello", "Welcome back"];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  return (
    <div className="pl-2">
      <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        {getGreeting()}, {firstName}
        <span className="animate-bounce text-lg">👋</span>
      </h1>
    </div>
  );
};