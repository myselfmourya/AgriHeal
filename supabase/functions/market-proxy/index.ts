import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

function corsHeaders(origin: string | null): Record<string, string> {
  // Any localhost/127.0.0.1 origin is allowed regardless of port — dev servers
  // pick a fallback port when the default is busy (e.g. 5174 instead of 5173).
  // Non-local origins must still match ALLOWED_ORIGINS exactly.
  const isLocalDev = !!origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  const allowed = origin && (ALLOWED_ORIGINS.includes(origin) || isLocalDev) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

// data.gov.in "Current Daily Price of Various Commodities from Various Markets (Mandi)" resource
const DATA_GOV_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'

serve(async (req) => {
  const origin = req.headers.get('origin')

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(origin) })
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

    const { state = 'Telangana', commodity = null, limit = 100 } = await req.json().catch(() => ({}))

    const apiKey = Deno.env.get('DATA_GOV_IN_API_KEY')
    if (!apiKey) {
      throw new Error('Missing DATA_GOV_IN_API_KEY')
    }

    const url = new URL(`https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}`)
    url.searchParams.set('api-key', apiKey)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('filters[state]', state)
    if (commodity) url.searchParams.set('filters[commodity]', commodity)

    const response = await fetch(url.toString())
    const data = await response.json()

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        status: response.status,
      })
    }

    return new Response(JSON.stringify({ records: data.records || [] }), {
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
