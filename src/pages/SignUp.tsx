import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const SignUp = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <Link to="/" className="inline-block mb-8">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="text-muted-foreground">
            Sign up to start managing your finances
          </p>
        </div>

        <form className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            className="h-14 rounded-[12px]"
          />
          <Input
            type="email"
            placeholder="Email"
            className="h-14 rounded-[12px]"
          />
          <Input
            type="password"
            placeholder="Password"
            className="h-14 rounded-[12px]"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            className="h-14 rounded-[12px]"
          />
          <Button className="w-full h-14 rounded-[12px] text-base">
            Create Account
          </Button>
        </form>

        <p className="text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};