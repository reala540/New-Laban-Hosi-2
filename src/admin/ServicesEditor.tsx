import { useState } from 'react'
import { createService, updateService, deleteService, type ServiceItem } from '../lib/api'
import { useToast } from './Toast'
import { useConfirmDialog } from './useConfirmDialog'

type Draft = ServiceItem & { isNew?: boolean }

function blankDraft(): Draft {
  return { id: `new-${Math.random().toString(36).slice(2)}`, name: '', description: '', icon: '🏥', isNew: true }
}

interface Props {
  services: ServiceItem[]
  secretKey: string
}

export default function ServicesEditor({ services: initial, secretKey }: Props) {
  const [items, setItems] = useState<Draft[]>(initial)
  const [savingId, setSavingId] = useState<string | null>(null)
  const { showToast } = useToast()
  const { ask, dialog } = useConfirmDialog()

  const patch = (id: string, fields: Partial<Draft>) => {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...fields } : s)))
  }

  const addDraft = () => setItems((prev) => [blankDraft(), ...prev])
  const cancelDraft = (id: string) => setItems((prev) => prev.filter((s) => s.id !== id))

  const save = async (item: Draft) => {
    if (!item.name.trim()) {
      showToast('error', 'Please add a name first')
      return
    }
    setSavingId(item.id)
    try {
      if (item.isNew) {
        const created = await createService(
          { name: item.name, description: item.description, icon: item.icon },
          secretKey
        )
        setItems((prev) => prev.map((s) => (s.id === item.id ? created : s)))
        showToast('success', 'Service added')
      } else {
        const updated = await updateService(item, secretKey)
        setItems((prev) => prev.map((s) => (s.id === item.id ? updated : s)))
        showToast('success', 'Service updated')
      }
    } catch (err) {
      showToast('error', (err as Error).message || 'Failed to save service')
    } finally {
      setSavingId(null)
    }
  }

  const remove = (item: Draft) => {
    if (item.isNew) {
      cancelDraft(item.id)
      return
    }
    ask('Remove service?', `"${item.name || 'Untitled service'}" will be permanently removed.`, async () => {
      setSavingId(item.id)
      try {
        await deleteService(item.id, secretKey)
        setItems((prev) => prev.filter((s) => s.id !== item.id))
        showToast('success', 'Service removed')
      } catch (err) {
        showToast('error', (err as Error).message || 'Failed to remove service')
      } finally {
        setSavingId(null)
      }
    })
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <h2>Services offered</h2>
        <p className="admin-hint">These appear on the public "Our Services" section.</p>
      </div>

      <button className="admin-add-btn" onClick={addDraft}>
        + Add service
      </button>

      {items.length === 0 && <p className="admin-empty">No services yet - add one above.</p>}

      {items.map((service) => (
        <div key={service.id} className="admin-repeater-item">
          <div className="admin-repeater-row">
            <input
              placeholder="Icon (emoji)"
              value={service.icon}
              style={{ maxWidth: '70px' }}
              onChange={(e) => patch(service.id, { icon: e.target.value })}
            />
            <input
              placeholder="Name"
              value={service.name}
              onChange={(e) => patch(service.id, { name: e.target.value })}
            />
          </div>
          <textarea
            placeholder="Description"
            value={service.description}
            rows={2}
            onChange={(e) => patch(service.id, { description: e.target.value })}
          />
          <div className="admin-repeater-row">
            <button className="admin-remove-btn" onClick={() => remove(service)}>
              {service.isNew ? 'Cancel' : 'Remove'}
            </button>
          </div>
          <button
            className="admin-save-btn"
            disabled={savingId === service.id}
            onClick={() => save(service)}
          >
            {savingId === service.id ? 'Saving…' : service.isNew ? 'Create service' : 'Save changes'}
          </button>
        </div>
      ))}

      {dialog}
    </div>
  )
}
