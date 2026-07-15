import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../server/db.js'
import { applyCors } from '../server/cors.js'
import { requireAdmin } from '../server/auth.js'
import { withErrorHandling } from '../server/errorHandler.js'

async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res, 'POST, PUT, DELETE, OPTIONS')) return
  if (!requireAdmin(req, res)) return

  if (req.method === 'POST') {
    const { name, description, icon } = req.body || {}
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const [row] = await sql`
      insert into services (name, description, icon, sort_order)
      values (
        ${name},
        ${description || ''},
        ${icon || '🏥'},
        (select coalesce(max(sort_order), 0) + 1 from services)
      )
      returning id, name, description, icon
    `
    return res.status(201).json(row)
  }

  if (req.method === 'PUT') {
    const { id, name, description, icon } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Missing id' })
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const [row] = await sql`
      update services
      set name = ${name},
          description = ${description || ''},
          icon = ${icon || '🏥'},
          updated_at = now()
      where id = ${id}
      returning id, name, description, icon
    `
    if (!row) return res.status(404).json({ error: 'Service not found' })
    return res.status(200).json(row)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Missing id' })
    await sql`delete from services where id = ${id}`
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withErrorHandling('/api/services', handler)
