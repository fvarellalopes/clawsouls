import { NextRequest, NextResponse } from 'next/server'

// Blacklist of preset IDs to filter out
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

// Proxy to the external presets API with filtering
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Build the upstream URL
  const upstreamUrl = new URL('https://clawsouls.vercel.app/api/presets')
  
  // Forward all search params
  searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.append(key, value)
  })
  
  try {
    const response = await fetch(upstreamUrl.toString())
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch presets' }, { status: 500 })
    }
    
    const data = await response.json()
    
    // Filter out blacklisted presets
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.filter((preset: any) => !PRESET_BLACKLIST.has(preset.id))
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching presets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}