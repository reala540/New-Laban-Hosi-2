import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../server/db.js'
import { applyCors } from '../server/cors.js'
import { requireAdmin } from '../server/auth.js'
import { withErrorHandling } from '../server/errorHandler.js'

async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res, 'POST, PUT, DELETE, OPTIONS')) return
  if (!requireAdmin(req, res)) return

  if (req.method === 'POST') {
    const { name, specialty, bio, imageUrl } = req.body || {}
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const [row] = await sql`
      insert into doctors (name, specialty, bio, image_url, sort_order)
      values (
        ${name},
        ${specialty || ''},
        ${bio || ''},
        ${imageUrl || null},
        (select coalesce(max(sort_order), 0) + 1 from doctors)
      )
      returning id, name, specialty, bio, image_url as "imageUrl"
    `
    return res.status(201).json(row)
  }

  if (req.method === 'PUT') {
    const { id, name, specialty, bio, imageUrl } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Missing id' })
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const [row] = await sql`
      update doctors
      set name = ${name},
          specialty = ${specialty || ''},
          bio = ${bio || ''},
          image_url = ${imageUrl || null},
          updated_at = now()
      where id = ${id}
      returning id, name, specialty, bio, image_url as "imageUrl"
    `
    if (!row) return res.status(404).json({ error: 'Doctor not found' })
    return res.status(200).json(row)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Missing id' })
    await sql`delete from doctors where id = ${id}`
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withErrorHandling('/api/doctors', handler)
