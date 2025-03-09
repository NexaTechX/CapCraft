import { create } from "zustand";
import { supabase } from "./supabase";

export interface ProfileSettings {
  name: string;
  avatarUrl?: string;
  defaultTone: string;
  defaultLanguage: string;
  preferredHashtags: string[];
  emojiStyle: "minimal" | "moderate" | "expressive";
}

interface ProfileStore {
  settings: ProfileSettings;
  loading: boolean;
  initialize: () => Promise<void>;
  updateSettings: (settings: Partial<ProfileSettings>) => Promise<void>;
}

const defaultSettings: ProfileSettings = {
  name: "User",
  defaultTone: "casual",
  defaultLanguage: "en",
  preferredHashtags: [],
  emojiStyle: "moderate",
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  settings: defaultSettings,
  loading: false,
  initialize: async () => {
    set({ loading: true });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      set({ loading: false });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profile_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (!data) {
        const initialSettings = {
          user_id: user.id,
          name: user.email?.split("@")[0] || "User",
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          default_tone: defaultSettings.defaultTone,
          default_language: defaultSettings.defaultLanguage,
          preferred_hashtags: defaultSettings.preferredHashtags,
          emoji_style: defaultSettings.emojiStyle,
        };

        const { error: insertError } = await supabase
          .from("profile_settings")
          .insert(initialSettings);

        if (insertError) throw insertError;
        set({
          settings: {
            name: initialSettings.name,
            avatarUrl: initialSettings.avatar_url,
            defaultTone: initialSettings.default_tone,
            defaultLanguage: initialSettings.default_language,
            preferredHashtags: initialSettings.preferred_hashtags || [],
            emojiStyle: initialSettings.emoji_style as any,
          },
          loading: false,
        });
      } else {
        set({
          settings: {
            name: data.name || user.email?.split("@")[0] || "User",
            avatarUrl: data.avatar_url,
            defaultTone: data.default_tone || defaultSettings.defaultTone,
            defaultLanguage:
              data.default_language || defaultSettings.defaultLanguage,
            preferredHashtags: data.preferred_hashtags || [],
            emojiStyle: data.emoji_style || defaultSettings.emojiStyle,
          },
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error initializing profile settings:", error);
      // Set default values on error
      set({
        settings: {
          ...defaultSettings,
          name: user.email?.split("@")[0] || "User",
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        },
        loading: false,
      });
    }
  },
  updateSettings: async (newSettings) => {
    try {
      set({ loading: true });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Convert camelCase to snake_case for database fields
      const dbSettings: any = {
        user_id: user.id,
        name: newSettings.name,
        default_tone: newSettings.defaultTone,
        default_language: newSettings.defaultLanguage,
        preferred_hashtags: newSettings.preferredHashtags,
        emoji_style: newSettings.emojiStyle,
        updated_at: new Date().toISOString(),
      };

      // Only add avatar_url if it exists in newSettings
      if (newSettings.avatarUrl) {
        dbSettings.avatar_url = newSettings.avatarUrl;
      }

      const { error } = await supabase
        .from("profile_settings")
        .upsert(dbSettings);

      if (error) throw error;

      set((state) => ({
        settings: { ...state.settings, ...newSettings },
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating profile settings:", error);
      set({ loading: false });
      throw error;
    }
  },
}));
