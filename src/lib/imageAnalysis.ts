import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAj0x2tyqFkOG7lDCHk3ShzQAxpfat4Pcc";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeImage(file: File): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload an image file");
    }

    // Validate file size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      throw new Error("Image size should be less than 4MB");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Convert File to base64
    const fileBuffer = await file.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(fileBuffer)),
    );

    const prompt = `Analyze this image and provide relevant keywords and context for social media captions. Focus on:
1. Main subjects/objects
2. Actions/activities
3. Setting/location
4. Mood/atmosphere
5. Style/aesthetic
6. Colors/visual elements

Format the response as a concise, comma-separated list of relevant keywords and short phrases.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
    ]);

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    if (error.message.includes("PERMISSION_DENIED")) {
      throw new Error("API key error. Please check your configuration.");
    } else if (error.message.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("API quota exceeded. Please try again later.");
    } else if (error.message.includes("INVALID_ARGUMENT")) {
      throw new Error("Invalid image format. Please try another image.");
    } else {
      throw new Error(error.message || "Failed to analyze image");
    }
  }
}
