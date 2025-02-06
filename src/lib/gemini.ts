import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the generative AI model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Validate if the image is base64 and within size limits
function isValidBase64Image(imageData: string): boolean {
  try {
    // Check if the image data starts with "data:image/"
    if (!imageData.startsWith('data:image/')) {
      return false;
    }

    const base64 = imageData.split(',')[1]; // Extract base64 string
    if (!base64) {
      return false;
    }

    // Calculate image size in bytes, ensure it's less than 4MB
    const sizeInBytes = atob(base64).length;
    return sizeInBytes < 4 * 1024 * 1024; // 4MB limit
  } catch {
    return false;
  }
}

// Analyze the image and provide a solution based on user preference
export async function analyzeImage(imageData: string, preference: string = "detailed"): Promise<string> {
  try {
    // Validate the image data
    if (!isValidBase64Image(imageData)) {
      throw new Error('Invalid image data');
    }

    // Get the generative model from Google AI
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a dynamic prompt based on user preference
    const prompt = `You are a helpful teaching assistant. Please analyze the image and provide a ${preference} solution for any academic problem. If there’s no problem, explain politely.`;

    // Generate content based on the image and the prompt
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData.split(',')[1],  // Base64 data without 'data:image/'
          mimeType: 'image/jpeg',  // Image MIME type
        },
      },
    ]);

    // Check for the response and return the text, with a fallback message
    if (result.response && result.response.text) {
      return await result.response.text();
    }

    return 'Invalid response format from the AI. Please try again.';
  } catch (error) {
    // Handle errors and return a user-friendly message
    console.error('Error analyzing image:', error);
    if (error instanceof Error) {
      return `Sorry, I encountered an error: ${error.message}. Please try again.`;
    }
    return 'Sorry, I encountered an error while analyzing the image. Please try again.';
  }
}
