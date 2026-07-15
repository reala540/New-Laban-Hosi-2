import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../server/db.js'
import { applyCors } from '../server/cors.js'
import { requireAdmin } from '../server/auth.js'
import { withErrorHandling } from '../server/errorHandler.js'

async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res, 'POST, PUT, DELETE, OPTIONS')) return
  if (!requireAdmin(req, res)) return

  if (req.method === 'POST') {
    const { title, description, imageUrl, active } = req.body || {}
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const [row] = await sql`
      insert into offers (title, description, image_url, active, sort_order)
      values (
        ${title},
        ${description || ''},
        ${imageUrl || null},
        ${active !== false},
        (select coalesce(max(sort_order), 0) + 1 from offers)
      )
      returning id, title, description, image_url as "imageUrl", active
    `
    return res.status(201).json(row)
  }

  if (req.method === 'PUT') {
    const { id, title, description, imageUrl, active } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Missing id' })
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const [row] = await sql`
      update offers
      set title = ${title},
          description = ${description || ''},
          image_url = ${imageUrl || null},
          active = ${active !== false},
          updated_at = now()
      where id = ${id}
      returning id, title, description, image_url as "imageUrl", active
    `
    if (!row) return res.status(404).json({ error: 'Offer not found' })
    return res.status(200).json(row)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Missing id' })
    await sql`delete from offers where id = ${id}`
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withErrorHandling('/api/offers', handler)
