/**
 * AgriHeal — AI Provider (Proxy Client)
 *
 * All AI calls are routed through the Supabase `ai-proxy` Edge Function.
 * NO provider API keys exist in this file or in any VITE_* environment variable.
 *
 * Public API (unchanged — all callers work without modification):
 *   generateText(prompt, systemInstruction?)
 *   generateStructuredResponse(prompt, schemaDescription, systemInstruction?)
 *   analyzeImage(base64Image, prompt, mimeType?)
 *   translate(text, targetLanguage)
 *   summarize(text)
 *   analyzeDocument(text, task)
 *   generateReport(data, reportType)
 */

import { supabase } from '../lib/supabase';

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
  const { data, error } = await supabase.functions.invoke('ai-proxy', {
    body: { intent, prompt, systemInstruction, base64Image, mimeType },
  });

  if (error) throw new Error(`[ai-proxy] ${error.message}`);
  if (!data?.text) throw new Error('[ai-proxy] Empty response from server');

  return data.text;
}

// ── Public interfaces (identical signatures to the old aiProvider.js) ───────

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

  return JSON.parse(result);
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
