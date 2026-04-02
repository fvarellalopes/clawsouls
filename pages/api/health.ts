import type { NextApiRequest, NextApiResponse } from 'next'
import { health_check } from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limit: 30 requests per minute (health checks should be infrequent)
  if (!rateLimit(req, res, { max: 30, windowMs: 60_000 })) {
    return;
  }

  try {
    const status = health_check()
    res.status(200).json(status)
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({ status: 'unhealthy', error: (error as Error).message })
  }
}
