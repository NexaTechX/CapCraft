// API endpoints and types for caption generation

export interface GenerateCaptionParams {
  keywords: string;
  image?: File;
  tone: string;
  language: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
}

export interface Caption {
  id: string;
  text: string;
  tone: string;
  language: string;
  hashtags: string[];
  emojis: string[];
  createdAt: Date;
}

// Mock API call - Replace with actual API integration
export const generateCaptions = async (
  params: GenerateCaptionParams,
): Promise<Caption[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock response
  return [
    {
      id: Math.random().toString(36).substr(2, 9),
      text: `${params.includeEmojis ? "✨ " : ""}Living my best life! ${params.includeHashtags ? "#Lifestyle #Happy" : ""}`,
      tone: params.tone,
      language: params.language,
      hashtags: ["#Lifestyle", "#Happy"],
      emojis: ["✨"],
      createdAt: new Date(),
    },
    {
      id: Math.random().toString(36).substr(2, 9),
      text: `${params.includeEmojis ? "🌟 " : ""}Making memories that last forever ${params.includeHashtags ? "#Memories #Life" : ""}`,
      tone: params.tone,
      language: params.language,
      hashtags: ["#Memories", "#Life"],
      emojis: ["🌟"],
      createdAt: new Date(),
    },
    {
      id: Math.random().toString(36).substr(2, 9),
      text: `${params.includeEmojis ? "💫 " : ""}Every day is a new adventure ${params.includeHashtags ? "#Adventure #Journey" : ""}`,
      tone: params.tone,
      language: params.language,
      hashtags: ["#Adventure", "#Journey"],
      emojis: ["💫"],
      createdAt: new Date(),
    },
  ];
};
