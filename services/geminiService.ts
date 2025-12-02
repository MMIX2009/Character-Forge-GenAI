import { GoogleGenAI } from "@google/genai";
import { GenerationParams, ReferenceImage, AspectRatio } from "../types";

// Helper to check for API Key selection for the paid model
export const ensureApiKey = async (): Promise<boolean> => {
  // @ts-ignore - Window extension for AI Studio
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
     // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
       // @ts-ignore
      await window.aistudio.openSelectKey();
      return true;
    }
    return true;
  }
  return true; // Fallback if not running in specific environment
};

export const generateCharacterImage = async (
  references: ReferenceImage[],
  params: GenerationParams
): Promise<string> => {
  await ensureApiKey();
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Map user aspect ratio to API supported string
  let apiAspectRatio = params.aspectRatio;

  // Construct the sophisticated prompt
  const parts: any[] = [];

  // 1. Add Reference Images
  references.forEach(ref => {
    parts.push({
      inlineData: {
        mimeType: ref.mimeType,
        data: ref.data
      }
    });
  });

  // 2. Build Text Prompt
  let promptText = `Generate a ${params.resolution === '4K' ? 'highly detailed 4K' : 'high-quality'} image.
  
  CHARACTER REFERENCE:
  The images provided above are the reference for the character. Maintain the character's facial features, body type, skin tone, hair style, and clothing details as consistently as possible across the new scene.

  SCENE & COMPOSITION:
  - Prompt: ${params.prompt}
  - Camera Angle: ${params.cameraAngle}
  - Render Style: ${params.renderMode}
  - Lighting: ${params.lighting}
  `;

  if (params.isTransparentMode) {
    promptText += `\n- IMPORTANT: Generate the character isolated on a solid white or transparent background. No complex background scenery. Full body or frame as described.`;
  } else {
    promptText += `\n- Background: Fully rendered, detailed background matching the scene description.`;
  }

  // Handle aspect ratio nuances in prompt if using approximations
  if (params.aspectRatio === AspectRatio.Standard) { // 4:3 acting as 3:2
     promptText += `\n- Composition: Frame the shot with a 3:2 aspect ratio aesthetic within the 4:3 output.`;
  }
  if (params.aspectRatio === AspectRatio.Portrait) { // 3:4 acting as 2:3
     promptText += `\n- Composition: Frame the shot with a 2:3 aspect ratio aesthetic within the 3:4 output.`;
  }

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // "Nano Banana Pro" equivalent
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: apiAspectRatio as any, 
          imageSize: params.resolution === '4K' ? '4K' : (params.resolution === '2K' ? '2K' : '1K')
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated.");
  } catch (error: any) {
    console.error("Generation failed", error);

    // Detect authentication errors and force key selection
    const msg = error.message || JSON.stringify(error);
    if (
      msg.includes("401") || 
      msg.includes("UNAUTHENTICATED") || 
      msg.includes("Requested entity was not found")
    ) {
      // @ts-ignore
      if (window.aistudio && window.aistudio.openSelectKey) {
         console.log("Auth failed, opening key selector...");
         // @ts-ignore
         await window.aistudio.openSelectKey();
         throw new Error("Authentication refreshed. Please click Generate again.");
      }
    }
    
    throw error;
  }
};