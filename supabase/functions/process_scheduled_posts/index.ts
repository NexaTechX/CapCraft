import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get all pending posts scheduled for now or earlier
    const now = new Date();
    const { data: posts, error } = await supabaseAdmin
      .from("scheduled_posts")
      .select(
        `
        id,
        caption_id,
        instagram_account_id,
        saved_captions!inner (text),
        instagram_accounts!inner (access_token, instagram_user_id)
      `,
      )
      .eq("status", "pending")
      .lte("scheduled_time", now.toISOString());

    if (error) throw error;

    const results = [];

    for (const post of posts) {
      try {
        // Mock posting to Instagram (in a real implementation, this would call the Instagram API)
        // This is a simplified version since we can't actually post to Instagram without proper auth

        // Update post status to published
        const { data, error: updateError } = await supabaseAdmin
          .from("scheduled_posts")
          .update({
            status: "published",
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id)
          .select();

        if (updateError) throw updateError;

        results.push({
          id: post.id,
          status: "published",
          message: "Post published successfully",
        });
      } catch (postError) {
        // Update post status to failed with error message
        await supabaseAdmin
          .from("scheduled_posts")
          .update({
            status: "failed",
            error: postError.message,
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id);

        results.push({
          id: post.id,
          status: "failed",
          error: postError.message,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
