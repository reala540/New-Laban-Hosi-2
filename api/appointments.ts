import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../server/db.js'
import { applyCors } from '../server/cors.js'
import { requireAdmin } from '../server/auth.js'
import { withErrorHandling } from '../server/errorHandler.js'

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res, 'GET, POST, PATCH, OPTIONS')) return

  // Public: anyone can submit an appointment request.
  if (req.method === 'POST') {
    const { fullName, email, phone, department, preferredDate, message } = req.body || {}
    if (typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required' })
    }

    await sql`
      insert into appointments (full_name, email, phone, department, preferred_date, message)
      values (${fullName}, ${email || null}, ${phone || null}, ${department || null}, ${preferredDate || null}, ${message || null})
    `
    return res.status(200).json({ success: true })
  }

  // Everything else (viewing, updating status) is admin-only - this data
  // includes patient contact details.
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const rows = await sql`
      select id, full_name as "fullName", email, phone, department,
             preferred_date as "preferredDate", message, status,
             created_at as "createdAt"
      from appointments
      order by created_at desc
    `
    return res.status(200).json(rows)
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {}
    if (!id || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Missing id or invalid status' })
    }
    await sql`update appointments set status = ${status} where id = ${id}`
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withErrorHandling('/api/appointments', handler)
