import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? 'https://agriheal.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: weatherResponse.status,
      })
    }

    return new Response(JSON.stringify(transform(data)), {
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
