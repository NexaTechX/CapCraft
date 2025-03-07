import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the provided key
const genAI = new GoogleGenerativeAI("AIzaSyAj0x2tyqFkOG7lDCHk3ShzQAxpfat4Pcc");

interface GenerateParams {
  keywords: string;
  image?: File;
  tone: string;
  language: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
  brandVoice?: string;
  imageContext?: string;
}

export async function generateSocialCaptions(params: GenerateParams) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

  const prompt = `You are a professional social media caption writer. Generate 3 creative and engaging Instagram captions.

Context:
${params.imageContext ? `Image Context: ${params.imageContext}\n` : ""}
Keywords: ${params.keywords}
Tone: ${params.tone}
Language: ${params.language}
${params.brandVoice ? `Brand Voice Guidelines: ${params.brandVoice}\n` : ""}

Requirements:
- Make each caption unique and engaging
- Use the specified tone consistently
- ${params.includeEmojis ? "Include 2-3 relevant emojis per caption, placed naturally" : "Do not use any emojis"}
- ${params.includeHashtags ? "Add 3-4 relevant hashtags at the end of each caption" : "Do not include any hashtags"}
- Keep each caption between 150-220 characters
- Focus on driving engagement and interaction
- Make it sound natural and authentic

Format each caption as:
1. [Caption 1]
2. [Caption 2]
3. [Caption 3]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Split the response into individual captions and clean them up
    const captions = text
      .split(/\d\.\s+/)
      .filter(Boolean)
      .map((caption) => ({
        id: Math.random().toString(36).substr(2, 9),
        text: caption.trim(),
        tone: params.tone,
        language: params.language,
        hashtags: caption.match(/#[\w]+/g) || [],
        emojis: Array.from(caption.match(/[\p{Emoji}]/gu) || []),
        createdAt: new Date(),
      }));

    return captions;
  } catch (error) {
    console.error("Error generating captions:", error);
    throw new Error("Failed to generate captions");
  }
}
