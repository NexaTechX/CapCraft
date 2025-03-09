import { supabase } from "./supabase";
import { useAuthStore } from "./auth";

// Helper function to check if tables exist and create them if they don't
export async function ensureTablesExist() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    // If profile doesn't exist, create it
    if (profileError && profileError.code === "PGRST116") {
      await supabase.from("profiles").insert({
        id: user.id,
        username: user.email?.split("@")[0] || "user",
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        updated_at: new Date().toISOString(),
      });
    }

    // Check if profile settings exist
    const { data: settings, error: settingsError } = await supabase
      .from("profile_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // If settings don't exist, create them
    if (settingsError && settingsError.code === "PGRST116") {
      // Create profile settings with correct field names
      await supabase.from("profile_settings").insert({
        user_id: user.id,
        name: user.email?.split("@")[0] || "User",
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        default_tone: "casual",
        default_language: "en",
        preferred_hashtags: [],
        emoji_style: "moderate",
      });
    }

    return true;
  } catch (error) {
    console.error("Error ensuring tables exist:", error);
    return false;
  }
}

// Initialize database tables when user logs in
export function initializeDatabase() {
  const { user } = useAuthStore();

  if (user) {
    ensureTablesExist();
  }
}
