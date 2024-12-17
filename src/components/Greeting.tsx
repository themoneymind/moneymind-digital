import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export const Greeting = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || 'there';
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Remove animation after initial render
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const greetings = ["Hi", "Hello"];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  return (
    <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
      {getGreeting()}, {firstName}
      <span className={showAnimation ? "animate-bounce text-lg" : "text-lg"}>👋</span>
    </h1>
  );
};