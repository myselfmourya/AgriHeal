/**
 * AgriHeal — AI Provider (Mistral Client-Side Direct)
 *
 * Modified to call Mistral API directly using fetch for prototyping.
 * Reads VITE_MISTRAL_API_KEY from environment variables.
 */

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

  let result = await callProxy({ intent: 'structured', prompt: fullPrompt, systemInstruction });

  result = result.trim();
  if (result.startsWith('```json')) result = result.slice(7, -3).trim();
  else if (result.startsWith('```')) result = result.slice(3, -3).trim();

  try {
    return JSON.parse(result);
  } catch (e) {
    console.error("Failed to parse JSON from Mistral:", result);
    throw new Error("Mistral returned invalid JSON");
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
