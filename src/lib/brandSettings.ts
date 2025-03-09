import { create } from "zustand";
import { supabase } from "./supabase";

export interface BrandSettings {
  name: string;
  defaultTone: string;
  defaultLanguage: string;
  preferredHashtags: string[];
  emojiStyle: "minimal" | "moderate" | "expressive";
}

export interface BrandVoiceGuidelines {
  tone: string;
  style: string;
  doList: string[];
  dontList: string[];
}

interface BrandStore {
  settings: BrandSettings;
  updateSettings: (settings: Partial<BrandSettings>) => void;
}

const defaultSettings: BrandSettings = {
  name: "My Brand",
  defaultTone: "casual",
  defaultLanguage: "en",
  preferredHashtags: [],
  emojiStyle: "moderate",
};

export const useBrandStore = create<BrandStore>((set, get) => ({
  settings: defaultSettings,
  updateSettings: async (newSettings) => {
    try {
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

      const { error } = await supabase
        .from("brand_settings")
        .upsert(dbSettings);

      if (error) throw error;

      set((state) => ({
        settings: { ...state.settings, ...newSettings },
      }));
    } catch (error) {
      console.error("Error updating brand settings:", error);
      throw error;
    }
  },
}));
