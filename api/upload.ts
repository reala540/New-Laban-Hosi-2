import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { applyCors } from '../server/cors.js'
import { withErrorHandling } from '../server/errorHandler.js'

// This route authorizes direct browser -> Vercel Blob uploads. Files never
// pass through this function's body, so there's no ~4.5MB payload limit -
// this matters for hospital photo/video uploads. Only images/videos ever
// go through Blob; everything else (banner, services, doctors, offers,
// appointments, messages) lives in Neon.
async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res, 'POST, OPTIONS')) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body as HandleUploadBody

  const jsonResponse = await handleUpload({
    token: process.env.BLOB_READ_WRITE_TOKEN,

    body,
    request: req,

    onBeforeGenerateToken: async (_pathname, clientPayload) => {
      let secret = ''

      try {
        secret = clientPayload ? JSON.parse(clientPayload).secret : ''
      } catch {
        secret = ''
      }

      if (!secret || secret !== process.env.ADMIN_SECRET) {
        throw new Error('Unauthorized')
      }

      return {
        allowedContentTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'video/mp4',
          'video/webm',
          'video/quicktime'
        ],
        addRandomSuffix: true,
        maximumSizeInBytes: 200 * 1024 * 1024 // 200MB
      }
    }
  })

  return res.status(200).json(jsonResponse)
}

export default withErrorHandling('/api/upload', handler)
