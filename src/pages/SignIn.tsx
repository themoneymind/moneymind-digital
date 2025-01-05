import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PiggyBank } from "lucide-react";
import { TopBar } from "@/components/TopBar";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        navigate("/app");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Starting sign in process with email:", email.trim());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Sign in error details:", error);
        
        if (error.message?.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and verify your account before signing in.",
            variant: "destructive",
          });
        } else if (error.message?.includes("Invalid login credentials") || error.status === 400) {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      if (!data?.user) {
        console.error("No user data received");
        toast({
          title: "Error",
          description: "Unable to sign in. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Check if this is a first-time user
      const { data: sources } = await supabase
        .from("payment_sources")
        .select("id")
        .eq("user_id", data.user.id)
        .limit(1);

      const isFirstTimeUser = !sources || sources.length === 0;
      localStorage.setItem("isFirstTimeUser", isFirstTimeUser.toString());

      console.log("Sign in successful:", data.user);
      toast({
        title: "Success",
        description: "Successfully signed in",
      });
      
      // Redirect based on user status
      if (isFirstTimeUser) {
        navigate("/app/payment-source");
      } else {
        navigate("/app");
      }
      
    } catch (error: any) {
      console.error("Unexpected sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] relative overflow-hidden">
      <TopBar title="Sign In" />
      
      {/* Decorative Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      
      <div className="p-6 pt-8 md:flex md:items-center md:justify-center md:min-h-[calc(100vh-64px)]">
        <div className="md:flex md:w-full md:max-w-6xl md:gap-8">
          {/* Left Column - Sign In Form */}
          <div className="md:flex-1 md:max-w-md">
            <div className="space-y-6 md:bg-white/50 md:backdrop-blur-sm md:p-8 md:rounded-2xl md:shadow-lg">
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
          </div>

          {/* Right Column - Decorative Area */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="relative w-full h-full min-h-[400px] rounded-2xl bg-gradient-to-br from-[#7F3DFF]/10 to-[#7F3DFF]/5 backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <PiggyBank className="w-32 h-32 text-[#7F3DFF]/20" />
              </div>
              <div className="absolute bottom-8 left-8 right-8 text-center">
                <h2 className="text-2xl font-bold text-[#7F3DFF]/70 mb-2">
                  Welcome to MoneyMind
                </h2>
                <p className="text-gray-600">
                  Track your expenses and manage your finances with ease
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};