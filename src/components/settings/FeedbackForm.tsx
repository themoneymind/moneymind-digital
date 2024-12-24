import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FeedbackForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            type: "feedback",
            email: user?.email,
            message,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send feedback");

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will review it carefully.",
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts, suggestions, or report issues..."
        className="min-h-[120px]"
        required
      />
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Submit Feedback"}
      </Button>
    </form>
  );
};