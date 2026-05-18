import { NextApiRequest } from 'next'
import { timingSafeEqual, randomBytes } from 'crypto'

export function verifyApiKey(req: NextApiRequest): boolean {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.slice(7)
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY
  if (!ADMIN_API_KEY) return false

  // Constant-time comparison to prevent timing attacks
  const tokenBuf = Buffer.from(token)
  const keyBuf = Buffer.from(ADMIN_API_KEY)

  // If lengths differ, compare against random bytes to avoid early exit
  if (tokenBuf.length !== keyBuf.length) {
    timingSafeEqual(tokenBuf, randomBytes(keyBuf.length))
    return false
  }

  return timingSafeEqual(tokenBuf, keyBuf)
}
