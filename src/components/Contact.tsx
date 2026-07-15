import { useState } from 'react'
import { MapPin, Phone, Mail, AlertCircle } from 'lucide-react'
import { submitMessage } from '../lib/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await submitMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      })

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Get in Touch</h2>
        <p className="section-subtitle">
          Have questions? We're here to help. Contact us today.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', margin: '60px 0' }}>
          <div className="contact-info reveal">
            <div className="contact-card">
              <div className="contact-icon"><MapPin size={32} /></div>
              <h3>Address</h3>
              <p>P.O. BOX 22263-00400</p>
              <p>Murang'a – Kaharati</p>
              <p>Kenya</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><Phone size={32} /></div>
              <h3>Phone</h3>
              <p>
                <a href="tel:0717405323">0717 405 323</a>
              </p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><Mail size={32} /></div>
              <h3>Email</h3>
              <p>
                <a href="mailto:thelabanhospital@outlook.com">
                  thelabanhospital@outlook.com
                </a>
              </p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><AlertCircle size={32} /></div>
              <h3>Emergency</h3>
              <p style={{ color: 'var(--medical-red)', fontWeight: '700' }}>
                Call 0717 405 323 Immediately
              </p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>Available 24/7</p>
            </div>
          </div>

          <div className="form-container reveal">
            {success && (
              <div className="success-message">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            {error && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <h3>Send us a Message</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/*
          Generic map centered on Murang'a - Kaharati. If you have the hospital's
          exact Google Maps share link or coordinates, swap the src below for a
          precise pin - this one shows the area, not an exact building pin.
        */}
        <div className="map-embed reveal">
          <iframe
            src="https://www.google.com/maps?q=Murang%27a%20Kaharati%20Kenya&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="The Laban Hospital location map"
          />
        </div>
      </div>
    </section>
  )
}
