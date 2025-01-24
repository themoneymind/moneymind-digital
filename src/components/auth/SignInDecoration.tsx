import { PiggyBank } from "lucide-react";

export const SignInDecoration = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl bg-gradient-to-br from-primary-gradient-from/10 to-primary-gradient-to/5 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center">
        <PiggyBank className="w-32 h-32 text-primary/20" />
      </div>
      <div className="absolute bottom-8 left-8 right-8 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to bg-clip-text text-transparent mb-2">
          Welcome to MoneyMind
        </h2>
        <p className="text-gray-600">
          Track your expenses and manage your finances with ease
        </p>
      </div>
    </div>
  );
};