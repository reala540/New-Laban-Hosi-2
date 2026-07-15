import { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail, MapPin, Clock, AlertCircle } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      <div className="header-top">
        <div className="container header-top-inner">
          <div className="header-top-content">
            <div className="header-top-item">
              <Phone size={14} />
              <a href="tel:0717405323">0717 405 323</a>
            </div>
            <div className="header-top-item">
              <Mail size={14} />
              <a href="mailto:thelabanhospital@outlook.com">thelabanhospital@outlook.com</a>
            </div>
            <div className="header-top-item header-top-item-hide-sm">
              <MapPin size={14} />
              <span>Murang&apos;a &ndash; Kaharati</span>
            </div>
            <div className="header-top-item header-top-item-hide-sm">
              <Clock size={14} />
              <span>Open 24 Hours</span>
            </div>
          </div>
          <div className="emergency-badge">
            <AlertCircle size={14} />
            Emergency: 0717 405 323
          </div>
        </div>
      </div>

      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <img src="/20260223_124122.jpg" alt="The Laban Hospital Logo" className="logo" />
              <div className="hospital-name">
                <h1>The Laban Hospital</h1>
                <p className="tagline">Compassionate Care. Advanced Medicine.</p>
              </div>
            </div>

            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <a onClick={() => scrollToSection('home')}>Home</a>
              <a onClick={() => scrollToSection('about')}>About</a>
              <a onClick={() => scrollToSection('services')}>Services</a>
              <a onClick={() => scrollToSection('doctors')}>Doctors</a>
              <a onClick={() => scrollToSection('contact')}>Contact</a>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
