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

      const { error } = await supabase.from("brand_settings").upsert({
        user_id: user.id,
        ...get().settings,
        ...newSettings,
      });

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
