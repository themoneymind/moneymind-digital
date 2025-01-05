import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, Lock, PiggyBank } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

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
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("rememberedEmail");
    }
    handleSubmit(e);
  };

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

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
            <Mail className="h-4 w-4 text-[#7F3DFF]" />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 pl-10 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
              <Lock className="h-4 w-4 text-[#7F3DFF]" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-10 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-gray-300"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link 
              to="/forgot-password" 
              className="text-sm text-[#7F3DFF] hover:text-[#7F3DFF]/90"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-gray-600 text-sm text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#7F3DFF] hover:text-[#7F3DFF]/90">
          Sign up
        </Link>
      </p>
    </div>
  );
};
