import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OtpSignInProps {
  email: string;
  setEmail: (email: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const PinSignIn = ({
  email,
  setEmail,
  isLoading,
}: OtpSignInProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const { toast } = useToast();

  const handleSendOtp = async () => {
    try {
      if (method === "email") {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
        });

        if (error) throw error;

        toast({
          title: "OTP Sent",
          description: "Please check your email for the login code",
        });
      } else {
        // Phone OTP functionality can be added here when Supabase supports it
        toast({
          title: "Coming Soon",
          description: "Phone number verification will be available soon!",
          variant: "destructive",
        });
        return;
      }

      setOtpSent(true);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp,
        type: 'email'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully verified OTP",
      });
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={method} onValueChange={(value) => setMethod(value as "email" | "phone")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <div className="relative">
            <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
              <Mail className="h-4 w-4 text-[#7F3DFF]" />
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
              disabled={isLoading || otpSent}
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="phone" className="space-y-4">
          <div className="relative">
            <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
              <Phone className="h-4 w-4 text-[#7F3DFF]" />
            </div>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
              disabled={isLoading || otpSent}
              required
            />
          </div>
        </TabsContent>
      </Tabs>

      {otpSent ? (
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full py-3 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
            maxLength={6}
            required
          />
          <Button 
            onClick={handleVerifyOtp}
            className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
            disabled={isLoading || !otp}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleSendOtp}
          className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
          disabled={isLoading || (!email && !phoneNumber)}
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </Button>
      )}
    </div>
  );
};