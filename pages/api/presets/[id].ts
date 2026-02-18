import type { NextApiRequest, NextApiResponse } from 'next'
import { get_preset_by_id } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing preset ID' })
  }

  try {
    const preset = get_preset_by_id(id)
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' })
    }
    res.status(200).json({ data: preset })
  } catch (error) {
    console.error('Get preset error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
