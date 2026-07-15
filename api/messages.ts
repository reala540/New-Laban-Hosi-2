import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../server/db.js'
import { applyCors } from '../server/cors.js'
import { requireAdmin } from '../server/auth.js'
import { withErrorHandling } from '../server/errorHandler.js'

const VALID_STATUSES = ['new', 'read', 'resolved']

async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res, 'GET, POST, PATCH, OPTIONS')) return

  // Public: anyone can send a contact message.
  if (req.method === 'POST') {
    const { name, email, phone, message } = req.body || {}
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    await sql`
      insert into contact_messages (name, email, phone, message)
      values (${name}, ${email || null}, ${phone || null}, ${message || null})
    `
    return res.status(200).json({ success: true })
  }

  // Everything else is admin-only - this data includes contact details.
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const rows = await sql`
      select id, name, email, phone, message, status, created_at as "createdAt"
      from contact_messages
      order by created_at desc
    `
    return res.status(200).json(rows)
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {}
    if (!id || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Missing id or invalid status' })
    }
    await sql`update contact_messages set status = ${status} where id = ${id}`
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withErrorHandling('/api/messages', handler)
