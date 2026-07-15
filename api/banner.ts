import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../server/db.js'
import { applyCors } from '../server/cors.js'
import { requireAdmin } from '../server/auth.js'
import { withErrorHandling } from '../server/errorHandler.js'

async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res, 'PUT, OPTIONS')) return

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!requireAdmin(req, res)) return

  const { active, message, type } = req.body || {}
  if (typeof active !== 'boolean' || typeof message !== 'string' || typeof type !== 'string') {
    return res.status(400).json({ error: 'Invalid banner payload' })
  }
  if (!['holiday', 'offer', 'info'].includes(type)) {
    return res.status(400).json({ error: 'Invalid banner type' })
  }

  await sql`
    update banner
    set active = ${active}, message = ${message}, type = ${type}, updated_at = now()
    where id = (select id from banner limit 1)
  `

  return res.status(200).json({ success: true })
}

export default withErrorHandling('/api/banner', handler)
