import { useState } from 'react'
import { createOffer, updateOffer, deleteOffer, uploadMedia, type Offer } from '../lib/api'
import { useToast } from './Toast'
import { useConfirmDialog } from './useConfirmDialog'

type Draft = Offer & { isNew?: boolean }

function blankDraft(): Draft {
  return { id: `new-${Math.random().toString(36).slice(2)}`, title: '', description: '', imageUrl: '', active: true, isNew: true }
}

interface Props {
  offers: Offer[]
  secretKey: string
}

export default function OffersEditor({ offers: initial, secretKey }: Props) {
  const [items, setItems] = useState<Draft[]>(initial)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const { showToast } = useToast()
  const { ask, dialog } = useConfirmDialog()

  const patch = (id: string, fields: Partial<Draft>) => {
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, ...fields } : o)))
  }

  const addDraft = () => setItems((prev) => [blankDraft(), ...prev])

  const cancelDraft = (id: string) => setItems((prev) => prev.filter((o) => o.id !== id))

  const save = async (item: Draft) => {
    if (!item.title.trim()) {
      showToast('error', 'Please add a title first')
      return
    }
    setSavingId(item.id)
    try {
      if (item.isNew) {
        const created = await createOffer(
          { title: item.title, description: item.description, imageUrl: item.imageUrl, active: item.active },
          secretKey
        )
        setItems((prev) => prev.map((o) => (o.id === item.id ? created : o)))
        showToast('success', 'Offer added')
      } else {
        const updated = await updateOffer(item, secretKey)
        setItems((prev) => prev.map((o) => (o.id === item.id ? updated : o)))
        showToast('success', 'Offer updated')
      }
    } catch (err) {
      showToast('error', (err as Error).message || 'Failed to save offer')
    } finally {
      setSavingId(null)
    }
  }

  const remove = (item: Draft) => {
    if (item.isNew) {
      cancelDraft(item.id)
      return
    }
    ask('Remove offer?', `"${item.title || 'Untitled offer'}" will be permanently removed.`, async () => {
      setSavingId(item.id)
      try {
        await deleteOffer(item.id, secretKey)
        setItems((prev) => prev.filter((o) => o.id !== item.id))
        showToast('success', 'Offer removed')
      } catch (err) {
        showToast('error', (err as Error).message || 'Failed to remove offer')
      } finally {
        setSavingId(null)
      }
    })
  }

  const handleImage = async (id: string, file: File) => {
    setProgress((p) => ({ ...p, [id]: 1 }))
    try {
      const url = await uploadMedia(file, secretKey, (pct) => setProgress((p) => ({ ...p, [id]: pct })))
      patch(id, { imageUrl: url })
      showToast('success', 'Image uploaded - remember to Save')
    } catch (err) {
      showToast('error', (err as Error).message || 'Image upload failed')
    } finally {
      setProgress((p) => {
        const next = { ...p }
        delete next[id]
        return next
      })
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <h2>Offers &amp; promotions</h2>
        <p className="admin-hint">e.g. "Free blood pressure check this Saturday".</p>
      </div>

      <button className="admin-add-btn" onClick={addDraft}>
        + Add offer
      </button>

      {items.length === 0 && <p className="admin-empty">No offers yet - add one above.</p>}

      {items.map((offer) => (
        <div key={offer.id} className="admin-repeater-item">
          <div className="admin-repeater-row">
            <label className="admin-checkbox admin-checkbox-inline">
              <input
                type="checkbox"
                checked={offer.active}
                onChange={(e) => patch(offer.id, { active: e.target.checked })}
              />
              Active
            </label>
            <button className="admin-remove-btn" onClick={() => remove(offer)}>
              {offer.isNew ? 'Cancel' : 'Remove'}
            </button>
          </div>
          <input
            placeholder="Title"
            value={offer.title}
            onChange={(e) => patch(offer.id, { title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={offer.description}
            rows={2}
            onChange={(e) => patch(offer.id, { description: e.target.value })}
          />
          {offer.imageUrl && <img src={offer.imageUrl} alt="" className="admin-preview" />}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImage(offer.id, e.target.files[0])}
          />
          {progress[offer.id] !== undefined && (
            <div className="admin-progress-track">
              <div className="admin-progress-fill" style={{ width: `${progress[offer.id]}%` }} />
            </div>
          )}
          <button
            className="admin-save-btn"
            disabled={savingId === offer.id}
            onClick={() => save(offer)}
          >
            {savingId === offer.id ? 'Saving…' : offer.isNew ? 'Create offer' : 'Save changes'}
          </button>
        </div>
      ))}

      {dialog}
    </div>
  )
}
