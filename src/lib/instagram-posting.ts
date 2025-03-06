import { supabase } from "./supabase";

export async function postToInstagram({
  caption,
  mediaUrl,
  accountId,
}: {
  caption: string;
  mediaUrl?: string;
  accountId: string;
}) {
  try {
    // Get the Instagram account details
    const { data: account, error: accountError } = await supabase
      .from("instagram_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (accountError) throw accountError;

    // Create the Instagram post
    const response = await fetch(
      `https://graph.facebook.com/v12.0/${account.instagram_user_id}/media`,
      {
        method: "POST",
        body: new URLSearchParams({
          access_token: account.access_token,
          caption,
          ...(mediaUrl && { image_url: mediaUrl }),
        }),
      },
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    // Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v12.0/${account.instagram_user_id}/media_publish`,
      {
        method: "POST",
        body: new URLSearchParams({
          access_token: account.access_token,
          creation_id: data.id,
        }),
      },
    );

    const publishData = await publishResponse.json();
    if (publishData.error) throw new Error(publishData.error.message);

    return publishData;
  } catch (error) {
    console.error("Error posting to Instagram:", error);
    throw error;
  }
}

export async function processScheduledPosts() {
  const now = new Date();

  // Get all pending posts scheduled for now or earlier
  const { data: posts, error } = await supabase
    .from("scheduled_posts")
    .select(
      `
      *,
      saved_captions (*),
      instagram_accounts (*)
    `,
    )
    .eq("status", "pending")
    .lte("scheduled_time", now.toISOString());

  if (error) throw error;

  for (const post of posts) {
    try {
      await postToInstagram({
        caption: post.saved_captions.text,
        accountId: post.instagram_accounts.id,
      });

      // Update post status to published
      await supabase
        .from("scheduled_posts")
        .update({ status: "published" })
        .eq("id", post.id);
    } catch (error) {
      // Update post status to failed with error message
      await supabase
        .from("scheduled_posts")
        .update({
          status: "failed",
          error: error.message,
        })
        .eq("id", post.id);
    }
  }
}
