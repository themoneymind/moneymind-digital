import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "feedback" | "contact";
  email: string;
  message: string;
  rating?: number;
  subject?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, message, rating, subject } = await req.json() as EmailRequest;

    console.log("Received request:", { type, email, message, rating, subject });

    const emailSubject = type === "feedback" 
      ? `New Feedback Received ${rating ? `(${rating} stars)` : ''}`
      : `New Contact Request: ${subject}`;

    const htmlContent = `
      <h2>${type === "feedback" ? "Feedback" : "Contact Request"} from ${email}</h2>
      ${rating ? `<p>Rating: ${rating} stars</p>` : ''}
      <p>${message}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "support@themoneymind.in",
        to: ["e.ravi@themoneymind.in"], // Updated to use your verified email
        subject: emailSubject,
        html: htmlContent,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      throw new Error(errorText);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-feedback function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);