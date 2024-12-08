import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <Link to="/signin" className="inline-block mb-8">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
          <p className="text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>

        <form className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            className="h-14 rounded-[12px]"
          />
          <Button className="w-full h-14 rounded-[12px] text-base">
            Reset Password
          </Button>
        </form>

        <p className="text-center text-muted-foreground">
          Remember your password?{" "}
          <Link to="/signin" className="text-primary font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};