import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ContactForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

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
            type: "contact",
            email: user?.email,
            subject,
            message,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
      />
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How can we help you?"
        className="min-h-[120px]"
        required
      />
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};