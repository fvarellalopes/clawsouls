import type { NextApiRequest, NextApiResponse } from 'next'
import { list_presets, count_presets, get_creature_types, get_sources, insert_preset } from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      if (!rateLimit(req, res, { max: 120, windowMs: 60_000 })) return;

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
        const [presets, total] = await Promise.all([
          list_presets(limitNum, offsetNum, creature as string | undefined, source as string | undefined, tagsList as string[] | undefined, search as string | undefined),
          count_presets(creature as string | undefined, source as string | undefined, tagsList as string[] | undefined, search as string | undefined)
        ])

        let facets: { creature: string[]; source: string[] } | null = null
        if (!creature && !source && !tags && !search) {
          const [creatureTypes, sources] = await Promise.all([
            get_creature_types(),
            get_sources()
          ])
          facets = { creature: creatureTypes, source: sources }
        }

        res.status(200).json({ data: presets, meta: { total, limit: limitNum, offset: offsetNum }, facets })
      } catch (error) {
        console.error('Presets API error:', error)
        res.status(500).json({ error: 'Internal server error' })
      }
      break
    }

    case 'POST': {
      if (!rateLimit(req, res, { max: 10, windowMs: 60_000 })) return;

      try {
        const preset = req.body
        if (!preset.id || !preset.name) {
          return res.status(400).json({ error: 'Preset must include id and name' })
        }

        // Sanitize id to prevent injection
        if (!/^[a-zA-Z0-9_-]+$/.test(preset.id)) {
          return res.status(400).json({ error: 'ID must be alphanumeric with hyphens/underscores' })
        }

        const success = await insert_preset(preset)
        if (!success) {
          return res.status(409).json({ error: 'Preset with this ID already exists' })
        }

        res.status(201).json({ success: true, id: preset.id })
      } catch (error) {
        console.error('Insert preset error:', error)
        res.status(500).json({ error: 'Internal server error' })
      }
      break
    }

    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
