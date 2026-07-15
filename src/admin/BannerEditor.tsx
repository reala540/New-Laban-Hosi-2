import { useState } from 'react'
import { saveBanner, type Banner } from '../lib/api'
import { useToast } from './Toast'

interface Props {
  banner: Banner
  secretKey: string
}

export default function BannerEditor({ banner: initial, secretKey }: Props) {
  const [banner, setBanner] = useState<Banner>(initial)
  const [saved, setSaved] = useState<Banner>(initial)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const dirty =
    banner.active !== saved.active ||
    banner.message !== saved.message ||
    banner.type !== saved.type

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveBanner(banner, secretKey)
      setSaved(banner)
      showToast('success', 'Banner saved - it is live on the site now.')
    } catch (err) {
      showToast('error', (err as Error).message || 'Failed to save banner')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <h2>Site-wide announcement banner</h2>
        <p className="admin-hint">
          Use this for things like holiday greetings or "Free BP check this Saturday". It shows
          at the very top of the site until a visitor dismisses it.
        </p>
      </div>

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={banner.active}
          onChange={(e) => setBanner({ ...banner, active: e.target.checked })}
        />
        Show banner on the site
      </label>

      <label className="admin-field">
        Message
        <textarea
          value={banner.message}
          onChange={(e) => setBanner({ ...banner, message: e.target.value })}
          rows={2}
          placeholder="e.g. Happy Holidays from all of us at The Laban Hospital!"
        />
      </label>

      <label className="admin-field">
        Style
        <select
          value={banner.type}
          onChange={(e) => setBanner({ ...banner, type: e.target.value as Banner['type'] })}
        >
          <option value="info">General info (dark)</option>
          <option value="holiday">Holiday greeting (red)</option>
          <option value="offer">Offer / promotion (orange)</option>
        </select>
      </label>

      {banner.message && <div className="admin-preview-label">Preview</div>}
      {banner.message && (
        <div className={`announcement-banner banner-${banner.type} admin-banner-preview`}>
          <div className="banner-content">
            <span>{banner.message}</span>
          </div>
        </div>
      )}

      <button className="admin-save-btn" disabled={saving || !dirty} onClick={handleSave}>
        {saving ? 'Saving…' : dirty ? 'Save banner' : 'Saved'}
      </button>
    </div>
  )
}
