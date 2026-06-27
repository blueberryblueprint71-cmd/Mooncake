import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

// Initialize the client. 
// Note: In a real app, exposing the API key in the frontend is a security risk.
// For this demo, we assume it's provided via environment or injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const generateChatResponse = async (
  systemInstruction: string,
  history: Message[],
  newMessage: string
): Promise<string> => {
  try {
    // Filter out system messages as Gemini API only accepts 'user' or 'model' roles
    const validHistory = history.filter(msg => msg.role === 'user' || msg.role === 'model');
    
    const contents = validHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Append the new user message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents as any, // Type assertion to bypass strict type checking if needed by the SDK version
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9, // Slightly higher for more creative roleplay
      }
    });

    return response.text || "Silence...";
  } catch (error) {
    console.error("Gemini API Error (Chat):", error);
    throw new Error("Failed to generate response. Please check your connection or API key.");
  }
};

export const generateImageResponse = async (
  prompt: string
): Promise<string> => {
  try {
    // Try official Imagen API first
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image Generation Error, falling back to demo generator:", error);
    // Fallback for demo purposes if API key is invalid/missing
    const encodedPrompt = encodeURIComponent(prompt);
    const randomSeed = Math.floor(Math.random() * 1000000);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${randomSeed}&width=512&height=512&nologo=true`;
  }
};