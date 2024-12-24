import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

export const FeedbackForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !rating) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('send-feedback', {
        body: {
          type: "feedback",
          email: user?.email,
          message,
          rating,
        },
      });

      if (!response.error) {
        toast({
          title: "Thank you for your feedback!",
          description: "We appreciate your input and will review it carefully.",
        });
        setMessage("");
        setRating(null);
      } else {
        throw new Error(response.error.message);
      }
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
      <div className="flex items-center justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
          >
            <Star
              className={`w-8 h-8 ${
                (hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0))
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts, suggestions, or report issues..."
        className="min-h-[120px] bg-background text-foreground"
      />
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting || (!message.trim() && !rating)}
      >
        {isSubmitting ? "Sending..." : "Submit Feedback"}
      </Button>
    </form>
  );
};