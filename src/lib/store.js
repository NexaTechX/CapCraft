import { create } from "zustand";
import { generateSocialCaptions } from "./gemini";
import { supabase } from "./supabase";

const useCaptionStore = create((set, get) => ({
  captions: [],
  savedCaptions: [],
  isGenerating: false,
  error: null,
  scheduledCaptions: [],

  // AI Caption Generation
  generateCaptions: async (params) => {
    set({ isGenerating: true, error: null });
    try {
      const { data: brandSettings } = await supabase
        .from("brand_settings")
        .select("*")
        .single();

      const newCaptions = await generateSocialCaptions({
        ...params,
        brandVoice: brandSettings
          ? `Brand name: ${brandSettings.name}\nTone: ${brandSettings.default_tone}\nPreferred hashtags: ${brandSettings.preferred_hashtags?.join(", ")}`
          : undefined,
      });

      set({ captions: newCaptions, isGenerating: false });
    } catch (error) {
      set({ error: "Failed to generate captions", isGenerating: false });
      throw error;
    }
  },

  // Caption Management
  saveCaption: async (caption) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("saved_captions")
        .insert({
          user_id: user.id,
          text: caption.text,
          tone: caption.tone,
          language: caption.language,
          hashtags: caption.hashtags,
          emojis: caption.emojis,
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        savedCaptions: [...state.savedCaptions, data],
      }));

      return data;
    } catch (error) {
      console.error("Error saving caption:", error);
      throw error;
    }
  },

  // Delete Caption
  deleteSavedCaption: async (id) => {
    try {
      const { error } = await supabase
        .from("saved_captions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        savedCaptions: state.savedCaptions.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting caption:", error);
      throw error;
    }
  },

  // Schedule Caption
  scheduleCaption: async (id, scheduledDate) => {
    try {
      const { error } = await supabase
        .from("saved_captions")
        .update({ scheduled_date: scheduledDate })
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        savedCaptions: state.savedCaptions.map((caption) =>
          caption.id === id
            ? { ...caption, scheduled: true, scheduledDate }
            : caption,
        ),
      }));
    } catch (error) {
      console.error("Error scheduling caption:", error);
      throw error;
    }
  },

  // Update Caption
  updateCaption: async (id, newText) => {
    try {
      const { error } = await supabase
        .from("saved_captions")
        .update({ text: newText })
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        savedCaptions: state.savedCaptions.map((caption) =>
          caption.id === id ? { ...caption, text: newText } : caption,
        ),
      }));
    } catch (error) {
      console.error("Error updating caption:", error);
      throw error;
    }
  },

  // Load User's Saved Captions
  loadSavedCaptions: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_captions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ savedCaptions: data || [] });
    } catch (error) {
      console.error("Error loading saved captions:", error);
      throw error;
    }
  },
}));

export { useCaptionStore };
