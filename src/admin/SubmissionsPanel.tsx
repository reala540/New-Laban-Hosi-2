import { useCallback, useEffect, useState } from 'react'
import {
  fetchAppointments,
  fetchMessages,
  updateAppointmentStatus,
  updateMessageStatus,
  type Submission
} from '../lib/api'
import { useToast } from './Toast'

const APPOINTMENT_FIELDS = [
  ['fullName', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['department', 'Department'],
  ['preferredDate', 'Preferred date'],
  ['message', 'Message']
] as const

const MESSAGE_FIELDS = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['message', 'Message']
] as const

const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']
const MESSAGE_STATUSES = ['new', 'read', 'resolved']

interface Props {
  secretKey: string
  kind: 'appointment' | 'message'
}

export default function SubmissionsPanel({ secretKey, kind }: Props) {
  const [items, setItems] = useState<Submission[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const fields = kind === 'appointment' ? APPOINTMENT_FIELDS : MESSAGE_FIELDS
  const statuses = kind === 'appointment' ? APPOINTMENT_STATUSES : MESSAGE_STATUSES
  const title = kind === 'appointment' ? 'Appointment requests' : 'Contact messages'

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const fetcher = kind === 'appointment' ? fetchAppointments : fetchMessages
    fetcher(secretKey)
      .then(setItems)
      .catch(() => setError('Could not load submissions. Check that your admin link is correct.'))
      .finally(() => setLoading(false))
  }, [secretKey, kind])

  useEffect(() => {
    load()
  }, [load])

  const changeStatus = async (id: string, status: string) => {
    try {
      if (kind === 'appointment') {
        await updateAppointmentStatus(id, status, secretKey)
      } else {
        await updateMessageStatus(id, status, secretKey)
      }
      setItems((prev) => prev && prev.map((entry) => (entry.id === id ? { ...entry, status } : entry)))
      showToast('success', 'Status updated')
    } catch (err) {
      showToast('error', (err as Error).message || 'Failed to update status')
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head admin-card-head-row">
        <div>
          <h2>{title}</h2>
          <p className="admin-hint">
            {kind === 'appointment'
              ? 'Requests submitted through the appointment form.'
              : 'Messages submitted through the contact form.'}
          </p>
        </div>
        <button className="admin-refresh-btn" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      {error && <p className="admin-status error">{error}</p>}
      {!error && loading && !items && <p>Loading…</p>}
      {!error && items && items.length === 0 && <p className="admin-empty">Nothing here yet.</p>}

      {!error &&
        items &&
        items.map((item) => (
          <div key={item.id} className="admin-submission">
            <div className="admin-submission-top">
              <span className="admin-submission-date">
                {new Date(item.createdAt).toLocaleString()}
              </span>
              <select
                className="admin-status-select"
                value={item.status || statuses[0]}
                onChange={(e) => changeStatus(item.id, e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {fields.map(([key, label]) =>
              item[key] ? (
                <div key={key} className="admin-submission-field">
                  <strong>{label}:</strong> {String(item[key])}
                </div>
              ) : null
            )}
          </div>
        ))}
    </div>
  )
}
