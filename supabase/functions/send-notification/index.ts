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

    // Fetch all profiles that have notification time set
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .not('notification_time', 'is', null);

    if (error) throw error;

    for (const profile of profiles) {
      if (profile.notification_time === currentTime) {
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        // Send notification using Supabase's built-in notification system
        await supabase.from('notifications').insert({
          user_id: profile.id,
          message: randomMessage,
          type: 'daily_reminder',
          read: false
        });

        console.log(`Notification sent to user ${profile.id}: ${randomMessage}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});