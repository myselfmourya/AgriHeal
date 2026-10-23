import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? 'https://agriheal.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// data.gov.in "Current Daily Price of Various Commodities from Various Markets (Mandi)" resource
const DATA_GOV_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'

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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      })
    }

    return new Response(JSON.stringify({ records: data.records || [] }), {
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
