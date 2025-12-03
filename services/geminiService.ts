import { GoogleGenAI } from "@google/genai";
import { PromptState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImagePrompt = async (data: PromptState): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
  Role: Professional Image Prompt Engineer.
  Task: Convert the following Persian (Farsi) parameters into a high-quality, detailed English prompt suitable for AI image generators like Midjourney or Stable Diffusion.
  
  Parameters:
  - Subject: ${data.subject}
  - Action/Context: ${data.actionJob}
  - Time/Location: ${data.timePlace}
  - Environment: ${data.environment}
  - Styles: ${data.styles.join(', ')}
  - Lighting: ${data.lighting.join(', ')}
  - Colors: ${data.palette.join(', ')} ${data.customColor !== '#000000' ? `(Accent hex: ${data.customColor})` : ''}
  - Mood: ${data.mood.join(', ')}
  - Quality: ${data.quality.join(', ')}
  - Technical: ${data.accelerators.join(', ')}
  - Camera: ${data.cameraAngles.join(', ')} using ${data.cameraLenses.join(', ')} lens.
  - Aspect Ratio: --ar ${data.aspectRatio.replace(':', ':')}
  - Negative Prompts (Avoid): ${data.negativeWords}

  Instructions:
  1. Translate the core ideas from Persian to English accurately.
  2. Structure the prompt as: [Subject + Action] + [Environment/Context] + [Art Styles/Medium] + [Lighting/Color/Mood] + [Camera/Technical].
  3. Append the Aspect Ratio at the very end.
  4. If Negative Prompts exist, append them using the --no parameter syntax.
  5. RETURN ONLY THE FINAL PROMPT STRING. NO EXPLANATIONS.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "خطا در ارتباط با هوش مصنوعی. لطفا دوباره تلاش کنید.";
  }
};