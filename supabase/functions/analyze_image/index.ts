import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { image } = await req.json();

    if (!image) {
      throw new Error("No image data provided");
    }

    // This is a fallback in case the client-side Gemini API fails
    // In a real implementation, you would call the Google Vision API or similar
    // For now, we'll return some generic keywords based on common image types

    const keywords = [
      "vibrant colors",
      "aesthetic composition",
      "lifestyle",
      "inspiration",
      "creative",
      "modern",
      "stylish",
      "trendy",
      "authentic",
      "genuine",
      "moment",
      "experience",
      "journey",
      "adventure",
      "story",
    ];

    // Randomly select 5-8 keywords
    const numKeywords = Math.floor(Math.random() * 4) + 5;
    const shuffled = [...keywords].sort(() => 0.5 - Math.random());
    const selectedKeywords = shuffled.slice(0, numKeywords);

    return new Response(
      JSON.stringify({
        success: true,
        keywords: selectedKeywords.join(", "),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
