import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailRequest {
  type: "feedback" | "contact";
  email: string;
  message: string;
  subject?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, message, subject } = await req.json() as EmailRequest;

    const emailSubject = type === "feedback" 
      ? "New Feedback Received"
      : subject || "New Contact Request";

    const htmlContent = `
      <h2>${type === "feedback" ? "Feedback" : "Contact Request"} from ${email}</h2>
      <p>${message}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MoneyMind Support <support@themoneymind.in>",
        to: ["support@themoneymind.in"],
        subject: emailSubject,
        html: htmlContent,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);