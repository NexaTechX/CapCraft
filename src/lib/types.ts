export interface SavedCaption {
  id: string;
  user_id: string;
  text: string;
  tone?: string;
  language?: string;
  hashtags?: string[];
  emojis?: string[];
  scheduled_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface BrandSetting {
  id: string;
  user_id: string;
  name: string;
  default_tone?: string;
  default_language?: string;
  preferred_hashtags?: string[];
  emoji_style?: "minimal" | "moderate" | "expressive";
  created_at: Date;
  updated_at: Date;
}
