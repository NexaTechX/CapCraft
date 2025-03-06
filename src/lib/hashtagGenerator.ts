import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAj0x2tyqFkOG7lDCHk3ShzQAxpfat4Pcc");

export async function generateHashtags(
  caption: string,
  count: number = 10,
): Promise<string[]> {
  try {
    if (!caption.trim()) {
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate ${count} relevant and trending hashtags for the following social media caption. 
    Return ONLY a comma-separated list of hashtags (including the # symbol), with no additional text or explanation.
    
    Caption: ${caption}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Split by commas and clean up each hashtag
    return text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.startsWith("#"))
      .slice(0, count);
  } catch (error) {
    console.error("Error generating hashtags:", error);
    return [];
  }
}

// Fallback function that doesn't require API calls
export function generateBasicHashtags(
  caption: string,
  count: number = 10,
): string[] {
  // Extract potential keywords from the caption
  const words = caption
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3) // Only words longer than 3 characters
    .filter(
      (word) =>
        ![
          "this",
          "that",
          "with",
          "from",
          "have",
          "your",
          "what",
          "when",
          "where",
          "which",
        ].includes(word),
    );

  // Common popular hashtags to mix in
  const popularHashtags = [
    "#instagood",
    "#photooftheday",
    "#love",
    "#fashion",
    "#beautiful",
    "#happy",
    "#cute",
    "#tbt",
    "#like4like",
    "#followme",
    "#picoftheday",
    "#follow",
    "#me",
    "#selfie",
    "#summer",
    "#art",
    "#instadaily",
    "#friends",
    "#repost",
    "#nature",
    "#girl",
    "#fun",
    "#style",
    "#smile",
    "#food",
    "#instalike",
    "#likeforlike",
    "#family",
    "#travel",
    "#fitness",
  ];

  // Create hashtags from the most relevant words
  const contentHashtags = words
    .slice(0, Math.min(words.length, Math.floor(count * 0.7)))
    .map((word) => `#${word}`);

  // Fill the rest with popular hashtags
  const remainingCount = count - contentHashtags.length;
  const selectedPopular = popularHashtags
    .sort(() => 0.5 - Math.random())
    .slice(0, remainingCount);

  return [...contentHashtags, ...selectedPopular].slice(0, count);
}
