import { supabase } from "./supabase";

export interface ScheduledPost {
  id: string;
  caption_id: string;
  platform: string;
  scheduled_time: Date;
  status: "pending" | "published" | "failed";
  error?: string;
}

export async function schedulePost(
  captionId: string,
  scheduledTime: Date,
  platform: string = "instagram",
) {
  const { data, error } = await supabase
    .from("scheduled_posts")
    .insert({
      caption_id: captionId,
      platform,
      scheduled_time: scheduledTime.toISOString(),
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getScheduledPosts(
  userId: string,
): Promise<ScheduledPost[]> {
  const { data, error } = await supabase
    .from("scheduled_posts")
    .select(
      `
      *,
      saved_captions!inner (*)
    `,
    )
    .eq("saved_captions.user_id", userId)
    .order("scheduled_time", { ascending: true });

  if (error) throw error;
  return data;
}

export async function cancelScheduledPost(postId: string) {
  const { error } = await supabase
    .from("scheduled_posts")
    .delete()
    .eq("id", postId);

  if (error) throw error;
}

export async function updateScheduledPost(postId: string, scheduledTime: Date) {
  const { error } = await supabase
    .from("scheduled_posts")
    .update({
      scheduled_time: scheduledTime.toISOString(),
    })
    .eq("id", postId);

  if (error) throw error;
}
