import { supabase } from "./supabase";

export interface InstagramWebhookData {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    changes: Array<{
      field: string;
      value: any;
    }>;
  }>;
}

export async function handleInstagramWebhook(data: InstagramWebhookData) {
  try {
    for (const entry of data.entry) {
      for (const change of entry.changes) {
        if (change.field === "media") {
          await trackMediaEngagement(entry.id, change.value);
        }
      }
    }
  } catch (error) {
    console.error("Error handling Instagram webhook:", error);
    throw error;
  }
}

async function trackMediaEngagement(mediaId: string, data: any) {
  const { error } = await supabase.from("post_analytics").insert({
    post_id: mediaId,
    platform: "instagram",
    likes: data.likes_count || 0,
    comments: data.comments_count || 0,
    shares: data.shares_count || 0,
    saves: data.saves_count || 0,
    impressions: data.impressions || 0,
    reach: data.reach || 0,
    profile_visits: data.profile_visits || 0,
    click_through_rate: data.click_through_rate || 0,
  });

  if (error) throw error;
}
