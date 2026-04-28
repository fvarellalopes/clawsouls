import type { NextApiRequest, NextApiResponse } from 'next'
import { get_preset_by_id, update_preset, delete_preset } from '@/lib/db'
import { verifyApiKey } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing preset ID' })
  }

  switch (req.method) {
    case 'GET': {
      if (!rateLimit(req, res, { max: 180, windowMs: 60_000 })) return;
      try {
        const preset = await get_preset_by_id(id)
        if (!preset) return res.status(404).json({ error: 'Preset not found' })
        res.status(200).json({ data: preset })
      } catch (error) {
        console.error('Get preset error:', error)
        res.status(500).json({ error: 'Internal server error' })
      }
      break
    }

    case 'PUT': {
      if (!rateLimit(req, res, { max: 30, windowMs: 60_000 })) return;
      if (!verifyApiKey(req)) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      try {
        const success = await update_preset(id, req.body)
        if (!success) return res.status(404).json({ error: 'Preset not found or no changes' })
        res.status(200).json({ success: true })
      } catch (error) {
        console.error('Update preset error:', error)
        res.status(500).json({ error: 'Internal server error' })
      }
      break
    }

    case 'DELETE': {
      if (!rateLimit(req, res, { max: 10, windowMs: 60_000 })) return;
      if (!verifyApiKey(req)) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      try {
        const success = await delete_preset(id)
        if (!success) return res.status(404).json({ error: 'Preset not found' })
        res.status(200).json({ success: true })
      } catch (error) {
        console.error('Delete preset error:', error)
        res.status(500).json({ error: 'Internal server error' })
      }
      break
    }

    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
