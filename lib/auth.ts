import { NextApiRequest, NextApiResponse } from 'next'

export function verifyApiKey(req: NextApiRequest): boolean {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.slice(7)
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY
  return !!ADMIN_API_KEY && token === ADMIN_API_KEY
}
