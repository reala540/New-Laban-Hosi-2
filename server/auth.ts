import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Checks the x-admin-key header against ADMIN_SECRET.
 * Returns true and does nothing if valid. Returns false and sends a 401
 * response if invalid - callers should `return` immediately when this
 * returns false.
 */
export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const key = req.headers['x-admin-key']
  if (!key || key !== process.env.ADMIN_SECRET) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}
