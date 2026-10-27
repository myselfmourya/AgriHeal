import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

const transform = (data: any) => ({
  temperature: `${Math.round(data.main.temp)}°C`,
  tempRaw: Math.round(data.main.temp),
  feelsLike: `${Math.round(data.main.feels_like)}°C`,
  condition: data.weather[0].main,
  description: data.weather[0].description,
  humidity: `${data.main.humidity}%`,
  humidityRaw: data.main.humidity,
  wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
  rainChance: `${data.clouds?.all ?? 0}%`,
  city: data.name,
  source: 'api',
  timestamp: new Date().toISOString(),
  freshness: 'live',
})

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

    const { lat, lon, location } = await req.json().catch(() => ({}))

    const weatherApiKey = Deno.env.get('WEATHER_API_KEY')
    if (!weatherApiKey) {
      throw new Error('Missing WEATHER_API_KEY')
    }

    const url = new URL('https://api.openweathermap.org/data/2.5/weather')
    if (lat != null && lon != null) {
      url.searchParams.set('lat', String(lat))
      url.searchParams.set('lon', String(lon))
    } else if (location) {
      url.searchParams.set('q', location)
    } else {
      throw new Error('Missing lat/lon or location')
    }
    url.searchParams.set('appid', weatherApiKey)
    url.searchParams.set('units', 'metric')

    const weatherResponse = await fetch(url.toString())
    const data = await weatherResponse.json()

    if (!weatherResponse.ok) {
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        status: weatherResponse.status,
      })
    }

    return new Response(JSON.stringify(transform(data)), {
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
