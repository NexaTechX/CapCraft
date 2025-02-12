import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCM1ELpcJfuOhJoHymWGEfjY_XBTyHSZy0";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateSocialCaptions(params: {
  keywords: string;
  tone: string;
  language: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate 3 creative social media captions based on these keywords: "${params.keywords}"
  Tone: ${params.tone}
  Language: ${params.language}
  ${params.includeEmojis ? "Include relevant emojis" : "No emojis"}
  ${params.includeHashtags ? "Include relevant hashtags" : "No hashtags"}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Split the response into individual captions
  const captions = text
    .split("\n")
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
}
