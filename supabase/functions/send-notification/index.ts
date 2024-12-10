import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const motivationalMessages = [
  "Track your expenses today and watch your savings grow! 💰",
  "Small steps lead to big financial wins. Update your transactions! 📈",
  "Your financial future starts with today's choices. Let's track them! ✨",
  "Keep the momentum going! Update your expenses and stay on top! 🎯",
  "Financial success is built one transaction at a time. Ready to log yours? 💪",
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .not('notification_time', 'is', null);

    for (const profile of profiles) {
      if (profile.notification_time === currentTime) {
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        // Here you would integrate with a notification service (e.g., Firebase, OneSignal)
        console.log(`Sending notification to user ${profile.id}: ${randomMessage}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});