import { supabase } from "./supabase";

export interface InstagramAccount {
  id: string;
  instagram_user_id: string;
  access_token: string;
  username: string;
  profile_picture_url?: string;
  followers_count?: number;
  media_count?: number;
}

export async function linkInstagramAccount(code: string) {
  try {
    // Exchange code for access token
    const response = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
          client_secret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: `${window.location.origin}/auth/instagram/callback`,
          code,
        }),
      },
    );

    const { access_token, user_id } = await response.json();

    // Get user info
    const userResponse = await fetch(
      `https://graph.instagram.com/v12.0/${user_id}?fields=id,username,account_type&access_token=${access_token}`,
    );
    const userData = await userResponse.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Save to database
    const { data, error } = await supabase
      .from("instagram_accounts")
      .upsert({
        user_id: user.id,
        instagram_user_id: user_id,
        access_token,
        username: userData.username,
        profile_picture_url: userData.profile_picture_url,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error linking Instagram account:", error);
    throw error;
  }
}

export async function getInstagramAccounts(): Promise<InstagramAccount[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("instagram_accounts")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;
  return data;
}

export async function unlinkInstagramAccount(accountId: string) {
  const { error } = await supabase
    .from("instagram_accounts")
    .delete()
    .eq("id", accountId);

  if (error) throw error;
}
