import { create } from "zustand";
import { generateSocialCaptions } from "./gemini";

const store = (set) => ({
  captions: [],
  savedCaptions: [],
  isGenerating: false,
  error: null,
  generateCaptions: async (params) => {
    set({ isGenerating: true, error: null });
    try {
      const newCaptions = await generateSocialCaptions(params);
      set({ captions: newCaptions, isGenerating: false });
    } catch (error) {
      set({ error: "Failed to generate captions", isGenerating: false });
    }
  },
  saveCaptions: (caption) => {
    set((state) => ({
      savedCaptions: [...state.savedCaptions, caption],
    }));
  },
  deleteSavedCaption: (id) => {
    set((state) => ({
      savedCaptions: state.savedCaptions.filter((c) => c.id !== id),
    }));
  },
});

export const useCaptionStore = create(store);
