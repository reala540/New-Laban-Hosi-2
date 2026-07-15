import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../server/db.js'
import { applyCors } from '../server/cors.js'
import { requireAdmin } from '../server/auth.js'
import { withErrorHandling } from '../server/errorHandler.js'

async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res, 'POST, PUT, DELETE, OPTIONS')) return
  if (!requireAdmin(req, res)) return

  // Called right after a successful Blob upload, to record the file's URL.
  if (req.method === 'POST') {
    const { type, blobUrl, caption } = req.body || {}
    if (type !== 'image' && type !== 'video') {
      return res.status(400).json({ error: 'Invalid media type' })
    }
    if (typeof blobUrl !== 'string' || !blobUrl) {
      return res.status(400).json({ error: 'Missing blobUrl' })
    }

    const [row] = await sql`
      insert into gallery_items (type, blob_url, caption)
      values (${type}, ${blobUrl}, ${caption || ''})
      returning id, type, blob_url as "url", caption
    `
    return res.status(201).json(row)
  }

  if (req.method === 'PUT') {
    const { id, caption } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Missing id' })

    const [row] = await sql`
      update gallery_items
      set caption = ${caption || ''}
      where id = ${id}
      returning id, type, blob_url as "url", caption
    `
    if (!row) return res.status(404).json({ error: 'Gallery item not found' })
    return res.status(200).json(row)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Missing id' })
    await sql`delete from gallery_items where id = ${id}`
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withErrorHandling('/api/gallery', handler)
