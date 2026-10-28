import { supabase } from '../lib/supabase';
import { buildSystemInstruction } from './contextService';

// ── Core proxy call ────────────────────────────────────────────────────────

async function callProxy({
  intent = 'chat',
  prompt,
  systemInstruction = null,
  base64Image = null,
  mimeType = 'image/jpeg',
}: {
  intent?: 'chat' | 'image' | 'structured' | 'document';
  prompt: string;
  systemInstruction?: string | null;
  base64Image?: string | null;
  mimeType?: string;
}): Promise<string> {
  // Inject global context into the system instruction
  const finalSystemInstruction = buildSystemInstruction(systemInstruction || "You are Vani, an intelligent agricultural assistant for rural Indian farmers.");

  const { data, error } = await supabase.functions.invoke('ai-proxy', {
    body: { intent, prompt, systemInstruction: finalSystemInstruction, base64Image, mimeType },
  });

  if (error) {
    console.error("AI Proxy Error:", error);
    throw new Error(`[ai-proxy] ${error.message}`);
  }
  if (!data?.text) throw new Error('[ai-proxy] Empty response from server');

  return data.text;
}

// ── Public interfaces (identical signatures to the old aiProvider) ───────

export const generateText = async (
  prompt: string,
  systemInstruction: string | null = null
): Promise<string> => {
  return callProxy({ intent: 'chat', prompt, systemInstruction });
};

export const generateStructuredResponse = async (
  prompt: string,
  schemaDescription: string,
  systemInstruction: string | null = null
): Promise<unknown> => {
  const fullPrompt = `${prompt}\n\nIMPORTANT: You must return the output STRICTLY as a valid JSON object matching this description: ${schemaDescription}. Do not include markdown \`\`\`json blocks, just the raw JSON.`;

  const raw = await callProxy({ intent: 'structured', prompt: fullPrompt, systemInstruction });

  // Models don't reliably stick to "raw JSON only" — strip a ```json ... ```
  // fence wherever it appears (not just at the very start), and fall back to
  // the outermost {...} / [...] span so stray prose before/after the JSON
  // doesn't break parsing.
  let result = raw.trim();
  const fenceMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    result = fenceMatch[1].trim();
  } else {
    const firstBrace = result.search(/[{[]/);
    const lastBrace = Math.max(result.lastIndexOf('}'), result.lastIndexOf(']'));
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      result = result.slice(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(result);
  } catch (e) {
    console.error("Failed to parse JSON from AI response:", raw);
    throw new Error("AI returned invalid JSON");
  }
};

export const analyzeImage = async (
  base64Image: string,
  prompt: string,
  mimeType = 'image/jpeg'
): Promise<string> => {
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  return callProxy({ intent: 'image', prompt, base64Image: base64Data, mimeType });
};

export const translate = async (text: string, targetLanguage: string): Promise<string> => {
  const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translation, no extra commentary:\n\n${text}`;
  return callProxy({ intent: 'chat', prompt });
};

export const summarize = async (text: string): Promise<string> => {
  const prompt = `Summarize the following text concisely:\n\n${text}`;
  return callProxy({ intent: 'document', prompt });
};

export const analyzeDocument = async (text: string, task: string): Promise<string> => {
  const prompt = `Task: ${task}\n\nDocument Text:\n${text}`;
  return callProxy({ intent: 'document', prompt });
};

export const generateReport = async (data: unknown, reportType: string): Promise<unknown> => {
  const prompt = `Generate a ${reportType} report based on the following data:\n\n${JSON.stringify(data, null, 2)}`;
  return callProxy({ intent: 'structured', prompt });
};
