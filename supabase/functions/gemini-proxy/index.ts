import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? 'https://agriheal.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { prompt, imageBase64 } = await req.json()
    if (!prompt && !imageBase64) {
      throw new Error('Missing prompt or image')
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Missing GEMINI_API_KEY')
    }

    const safetySystemInstruction = `
      You are AgriHeal's AI assistant. 
      CRITICAL SAFETY RULES:
      1. NEVER provide definitive pesticide or chemical advice. 
      2. If asked for diagnosis, always state your confidence level and the limitations of AI.
      3. Always provide an expert-escalation path (e.g., "Please consult a certified agricultural expert for confirmation").
      4. Include source metadata for any factual claims.
    `;

    const parts = [{ text: safetySystemInstruction + "\n\n" + (prompt || "Analyze this image.") }];
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageBase64
        }
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }]
      })
    })

    const data = await geminiResponse.json()
    
    // Simple Audit Logging
    supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'AI_QUERY',
      details: { has_image: !!imageBase64, length: prompt?.length }
    }).then(({error}) => { if(error) console.error("Audit log error:", error) });

    if (!geminiResponse.ok) {
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: geminiResponse.status,
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
