import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PiggyBank } from "lucide-react";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SignInForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isLoading,
}: SignInFormProps) => {
  return (
    <div className="space-y-6">
      <div className="text-left space-y-2">
        <div className="flex items-center mb-2">
          <PiggyBank className="h-10 w-10 text-[#7F3DFF]" />
        </div>
        <h1 className="text-2xl font-bold text-[#7F3DFF]">MoneyMind</h1>
        <p className="text-gray-600 text-base">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-gray-900/70 placeholder:text-gray-500/60 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
          disabled={isLoading}
          required
        />
        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-gray-900/70 placeholder:text-gray-500/60 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
            disabled={isLoading}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div>
          <Link 
            to="/forgot-password" 
            className="text-sm text-[#7F3DFF] hover:text-[#7F3DFF]/90"
          >
            Forgot Password?
          </Link>
        </div>
      </form>

      <p className="text-gray-600 text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#7F3DFF] hover:text-[#7F3DFF]/90">
          Sign up
        </Link>
      </p>
    </div>
  );
};