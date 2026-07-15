import { useState } from 'react'
import { createDoctor, updateDoctor, deleteDoctor, uploadMedia, type Doctor } from '../lib/api'
import { useToast } from './Toast'
import { useConfirmDialog } from './useConfirmDialog'

type Draft = Doctor & { isNew?: boolean }

function blankDraft(): Draft {
  return { id: `new-${Math.random().toString(36).slice(2)}`, name: '', specialty: '', bio: '', imageUrl: '', isNew: true }
}

interface Props {
  doctors: Doctor[]
  secretKey: string
}

export default function DoctorsEditor({ doctors: initial, secretKey }: Props) {
  const [items, setItems] = useState<Draft[]>(initial)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const { showToast } = useToast()
  const { ask, dialog } = useConfirmDialog()

  const patch = (id: string, fields: Partial<Draft>) => {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, ...fields } : d)))
  }

  const addDraft = () => setItems((prev) => [blankDraft(), ...prev])
  const cancelDraft = (id: string) => setItems((prev) => prev.filter((d) => d.id !== id))

  const save = async (item: Draft) => {
    if (!item.name.trim()) {
      showToast('error', 'Please add a name first')
      return
    }
    setSavingId(item.id)
    try {
      if (item.isNew) {
        const created = await createDoctor(
          { name: item.name, specialty: item.specialty, bio: item.bio, imageUrl: item.imageUrl },
          secretKey
        )
        setItems((prev) => prev.map((d) => (d.id === item.id ? created : d)))
        showToast('success', 'Doctor added')
      } else {
        const updated = await updateDoctor(item, secretKey)
        setItems((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
        showToast('success', 'Doctor updated')
      }
    } catch (err) {
      showToast('error', (err as Error).message || 'Failed to save doctor')
    } finally {
      setSavingId(null)
    }
  }

  const remove = (item: Draft) => {
    if (item.isNew) {
      cancelDraft(item.id)
      return
    }
    ask('Remove doctor?', `"${item.name || 'Untitled entry'}" will be permanently removed.`, async () => {
      setSavingId(item.id)
      try {
        await deleteDoctor(item.id, secretKey)
        setItems((prev) => prev.filter((d) => d.id !== item.id))
        showToast('success', 'Doctor removed')
      } catch (err) {
        showToast('error', (err as Error).message || 'Failed to remove doctor')
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
      showToast('success', 'Photo uploaded - remember to Save')
    } catch (err) {
      showToast('error', (err as Error).message || 'Photo upload failed')
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
        <h2>Doctors</h2>
        <p className="admin-hint">These appear on the public "Our Medical Team" section.</p>
      </div>

      <button className="admin-add-btn" onClick={addDraft}>
        + Add doctor
      </button>

      {items.length === 0 && <p className="admin-empty">No doctors listed yet - add one above.</p>}

      {items.map((doctor) => (
        <div key={doctor.id} className="admin-repeater-item">
          <div className="admin-repeater-row">
            <input
              placeholder="Full name"
              value={doctor.name}
              onChange={(e) => patch(doctor.id, { name: e.target.value })}
            />
            <button className="admin-remove-btn" onClick={() => remove(doctor)}>
              {doctor.isNew ? 'Cancel' : 'Remove'}
            </button>
          </div>
          <input
            placeholder="Specialty"
            value={doctor.specialty}
            onChange={(e) => patch(doctor.id, { specialty: e.target.value })}
          />
          <textarea
            placeholder="Short bio"
            value={doctor.bio}
            rows={2}
            onChange={(e) => patch(doctor.id, { bio: e.target.value })}
          />
          {doctor.imageUrl && <img src={doctor.imageUrl} alt="" className="admin-preview" />}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImage(doctor.id, e.target.files[0])}
          />
          {progress[doctor.id] !== undefined && (
            <div className="admin-progress-track">
              <div className="admin-progress-fill" style={{ width: `${progress[doctor.id]}%` }} />
            </div>
          )}
          <button
            className="admin-save-btn"
            disabled={savingId === doctor.id}
            onClick={() => save(doctor)}
          >
            {savingId === doctor.id ? 'Saving…' : doctor.isNew ? 'Create doctor' : 'Save changes'}
          </button>
        </div>
      ))}

      {dialog}
    </div>
  )
}
