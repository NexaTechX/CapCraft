import { supabase } from "./supabase";

export async function getInstagramUserInfo(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.instagram.com/v12.0/me?fields=id,username,account_type,media_count&access_token=${accessToken}`,
    );
    return await response.json();
  } catch (error) {
    console.error("Error getting Instagram user info:", error);
    throw error;
  }
}

export async function saveInstagramToken(accessToken: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const userInfo = await getInstagramUserInfo(accessToken);

    const { data, error } = await supabase
      .from("instagram_accounts")
      .upsert({
        user_id: user.id,
        instagram_user_id: userInfo.id,
        access_token: accessToken,
        username: userInfo.username,
        media_count: userInfo.media_count,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving Instagram token:", error);
    throw error;
  }
}
