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
          ...defaultSettings,
          name: user.email?.split("@")[0] || "User",
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          user_id: user.id,
        };

        const { error: insertError } = await supabase
          .from("profile_settings")
          .insert(initialSettings);

        if (insertError) throw insertError;
        set({ settings: initialSettings, loading: false });
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

      const { error } = await supabase.from("profile_settings").upsert({
        user_id: user.id,
        name: newSettings.name,
        avatar_url: newSettings.avatarUrl,
        default_tone: newSettings.defaultTone,
        default_language: newSettings.defaultLanguage,
        preferred_hashtags: newSettings.preferredHashtags,
        emoji_style: newSettings.emojiStyle,
        updated_at: new Date().toISOString(),
      });

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
