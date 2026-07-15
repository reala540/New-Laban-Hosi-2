import { useState } from 'react'
import {
  uploadMedia,
  createGalleryItem,
  updateGalleryCaption,
  deleteGalleryItem,
  type GalleryItem
} from '../lib/api'
import { useToast } from './Toast'
import { useConfirmDialog } from './useConfirmDialog'

interface Props {
  gallery: GalleryItem[]
  secretKey: string
}

export default function GalleryEditor({ gallery: initial, secretKey }: Props) {
  const [items, setItems] = useState<GalleryItem[]>(initial)
  const [captionDrafts, setCaptionDrafts] = useState<Record<string, string>>({})
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const { showToast } = useToast()
  const { ask, dialog } = useConfirmDialog()

  const handleUpload = async (file: File) => {
    setUploadProgress(1)
    try {
      const url = await uploadMedia(file, secretKey, setUploadProgress)
      const type: GalleryItem['type'] = file.type.startsWith('video') ? 'video' : 'image'
      const created = await createGalleryItem({ type, blobUrl: url, caption: '' }, secretKey)
      setItems((prev) => [created, ...prev])
      showToast('success', `${type === 'video' ? 'Video' : 'Photo'} uploaded and live`)
    } catch (err) {
      showToast('error', (err as Error).message || 'Upload failed')
    } finally {
      setUploadProgress(null)
    }
  }

  const saveCaption = async (id: string) => {
    const caption = captionDrafts[id] ?? items.find((i) => i.id === id)?.caption ?? ''
    setSavingId(id)
    try {
      const updated = await updateGalleryCaption(id, caption, secretKey)
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
      setCaptionDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      showToast('success', 'Caption saved')
    } catch (err) {
      showToast('error', (err as Error).message || 'Failed to save caption')
    } finally {
      setSavingId(null)
    }
  }

  const removeItem = (item: GalleryItem) => {
    ask('Remove item?', 'This photo/video will be permanently removed from the gallery.', async () => {
      setSavingId(item.id)
      try {
        await deleteGalleryItem(item.id, secretKey)
        setItems((prev) => prev.filter((i) => i.id !== item.id))
        showToast('success', 'Removed from gallery')
      } catch (err) {
        showToast('error', (err as Error).message || 'Failed to remove item')
      } finally {
        setSavingId(null)
      }
    })
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <h2>Photo &amp; video gallery</h2>
        <p className="admin-hint">
          Upload photos or short videos of the facility, events, or staff. Each one appears on
          the site as soon as it finishes uploading.
        </p>
      </div>

      <label className="admin-upload-btn">
        + Upload photo or video
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
          hidden
        />
      </label>

      {uploadProgress !== null && (
        <div className="admin-progress-track" style={{ marginBottom: '16px' }}>
          <div className="admin-progress-fill" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {items.length === 0 && (
        <p className="admin-empty">Nothing in the gallery yet - upload something above.</p>
      )}

      <div className="admin-gallery-grid">
        {items.map((item) => {
          const draftCaption = captionDrafts[item.id] ?? item.caption ?? ''
          const dirty = draftCaption !== (item.caption ?? '')
          return (
            <div key={item.id} className="admin-repeater-item">
              {item.type === 'image' ? (
                <img src={item.url} alt="" className="admin-preview" />
              ) : (
                <video src={item.url} controls className="admin-preview" />
              )}
              <input
                placeholder="Caption (optional)"
                value={draftCaption}
                onChange={(e) =>
                  setCaptionDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
              />
              <div className="admin-repeater-row">
                <button
                  className="admin-remove-btn"
                  onClick={() => removeItem(item)}
                  disabled={savingId === item.id}
                >
                  Remove
                </button>
                {dirty && (
                  <button
                    className="admin-save-btn"
                    style={{ width: 'auto', padding: '8px 14px', fontSize: '13px' }}
                    disabled={savingId === item.id}
                    onClick={() => saveCaption(item.id)}
                  >
                    {savingId === item.id ? 'Saving…' : 'Save caption'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {dialog}
    </div>
  )
}
