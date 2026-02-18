import type { NextApiRequest, NextApiResponse } from 'next'
import { insert_preset } from '@/lib/db'
import { verifyApiKey } from '@/lib/auth'

// Simple API key auth for admin endpoints
const ADMIN_API_KEY = process.env.ADMIN_API_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Auth check
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }
  const token = authHeader.slice(7)
  if (!ADMIN_API_KEY || token !== ADMIN_API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' })
  }

  try {
    const preset = req.body
    if (!preset.id || !preset.name) {
      return res.status(400).json({ error: 'Preset must include id and name' })
    }

    const success = insert_preset(preset)
    if (!success) {
      return res.status(409).json({ error: 'Preset with this ID already exists' })
    }

    res.status(201).json({ success: true, message: 'Preset inserted', id: preset.id })
  } catch (error) {
    console.error('Insert preset error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
