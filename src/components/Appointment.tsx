import { useState } from 'react'
import { submitAppointment } from '../lib/api'

export default function Appointment() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    preferredDate: '',
    message: ''
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await submitAppointment({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        preferredDate: formData.preferredDate,
        message: formData.message
      })

      setSuccess(true)
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        preferredDate: '',
        message: ''
      })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Failed to book appointment. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="appointment" className="appointment-section">
      <div className="container">
        <h2 className="section-title">Book an Appointment</h2>
        <p className="section-subtitle">
          Schedule your medical appointment with our experienced doctors
        </p>

        <div className="form-container">
          {success && (
            <div className="success-message">
              ✓ Appointment booked successfully! We'll contact you soon.
            </div>
          )}

          {error && (
            <div style={{ background: '#f8d7da', color: '#721c24', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select a department</option>
                <option value="Emergency">Accident & Emergency</option>
                <option value="Outpatient">Outpatient Services</option>
                <option value="Maternity">Maternity Services</option>
                <option value="Laboratory">Laboratory Services</option>
                <option value="Surgery">Surgery</option>
                <option value="Radiology">Radiology</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Date *</label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Additional Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your symptoms or concerns..."
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
