import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface PasswordSignInProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const PasswordSignIn = ({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  handleSubmit,
  isLoading,
}: PasswordSignInProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
          <Mail className="h-4 w-4 text-[#7F3DFF]" />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
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
            className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
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
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};