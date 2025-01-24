import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignInDecoration } from "@/components/auth/SignInDecoration";

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
        } else if (error.message?.includes("Invalid login credentials")) {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please try again.",
            variant: "destructive",
          });
        } else if (error.status === 400) {
          toast({
            title: "Sign In Failed",
            description: "Please make sure you've confirmed your email and are using the correct password.",
            variant: "destructive",
          });
        } else if (error.status === 429) {
          toast({
            title: "Too Many Attempts",
            description: "Please wait a few minutes before trying again for security purposes.",
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
        navigate("/app/add-payment-source");
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
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Gradient overlay with increased opacity */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/50 via-blue-100/30 to-transparent"></div>
      
      <div className="p-6 pt-8 md:flex md:items-center md:justify-center md:min-h-screen">
        <div className="w-full max-w-6xl mx-auto">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            {/* Left Column - Sign In Form */}
            <div className="md:bg-white/10 backdrop-blur-sm md:p-8 md:rounded-2xl md:shadow-lg">
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column - Decorative Area */}
            <div className="hidden md:block">
              <SignInDecoration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};