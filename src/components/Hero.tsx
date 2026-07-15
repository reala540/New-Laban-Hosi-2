import { Clock, Stethoscope, Building2, HeartHandshake } from 'lucide-react'

const badges = [
  { icon: Clock, label: 'Open 24/7' },
  { icon: Stethoscope, label: 'Qualified Specialists' },
  { icon: Building2, label: 'Modern Facilities' },
  { icon: HeartHandshake, label: 'Compassionate Care' }
]

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToBook = () => {
    const element = document.getElementById('appointment')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="hero">
      <div className="hero-backdrop" aria-hidden="true">
        <span style={{ width: 220, height: 220, top: '-8%', left: '55%', borderRadius: 24, transform: 'rotate(18deg)' }} />
        <span style={{ width: 140, height: 140, top: '65%', left: '48%', borderRadius: 20, transform: 'rotate(-8deg)' }} />
        <span style={{ width: 90, height: 90, top: '10%', left: '78%', borderRadius: 16 }} />
      </div>
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-eyebrow">The Laban Hospital</span>
          <h2 className="hero-title">Welcome to The Laban Hospital</h2>
          <p className="hero-subtitle">
            Compassionate Care. Advanced Medicine. Trusted Professionals.
          </p>
          <div className="hero-ctas">
            <button className="cta-button" onClick={scrollToBook}>
              Book Appointment
            </button>
            <button className="cta-button outline" onClick={scrollToContact}>
              Contact Us
            </button>
          </div>
          <div className="hero-badges">
            {badges.map((b) => (
              <div className="hero-badge" key={b.label}>
                <b.icon size={18} />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <svg className="hero-mark" viewBox="0 0 400 380" xmlns="http://www.w3.org/2000/svg">
            <rect x="150" y="10" width="90" height="90" rx="8" fill="rgba(255,255,255,0.14)" />
            <rect x="70" y="110" width="170" height="90" rx="8" fill="rgba(255,255,255,0.22)" />
            <rect x="240" y="110" width="90" height="90" rx="8" fill="var(--olive)" opacity="0.85" />
            <rect x="70" y="210" width="170" height="90" rx="8" fill="rgba(255,255,255,0.14)" />
            <rect x="70" y="310" width="70" height="60" rx="8" fill="rgba(255,255,255,0.22)" />
            <rect x="150" y="210" width="90" height="160" rx="8" fill="rgba(255,255,255,0.3)" />
          </svg>

          <div className="hero-visual-card hero-visual-card-1">
            <Building2 size={22} />
            <div>
              <strong>24/7</strong>
              <span>Emergency Care</span>
            </div>
          </div>
          <div className="hero-visual-card hero-visual-card-2">
            <HeartHandshake size={22} />
            <div>
              <strong>Patient-first</strong>
              <span>Every visit, every time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
