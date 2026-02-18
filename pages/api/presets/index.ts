import type { NextApiRequest, NextApiResponse } from 'next'
import { list_presets, count_presets, get_creature_types, get_sources } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    limit = '50',
    offset = '0',
    creature,
    source,
    tags,
    search
  } = req.query

  const limitNum = Math.min(parseInt(limit as string, 10) || 50, 300)
  const offsetNum = parseInt(offset as string, 10) || 0

  const tagsList = Array.isArray(tags) ? tags : (tags ? [tags] : undefined)

  try {
    const presets = list_presets(
      limitNum,
      offsetNum,
      creature as string | undefined,
      source as string | undefined,
      tagsList as string[] | undefined,
      search as string | undefined
    )
    const total = count_presets(
      creature as string | undefined,
      source as string | undefined,
      tagsList as string[] | undefined,
      search as string | undefined
    )

    let facets: { creature: string[]; source: string[] } | null = null
    if (!creature && !source && !tags && !search) {
      facets = {
        creature: get_creature_types(),
        source: get_sources()
      }
    }

    res.status(200).json({
      data: presets,
      meta: {
        total,
        limit: limitNum,
        offset: offsetNum
      },
      facets
    })
  } catch (error) {
    console.error('Presets API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
