import { useContent } from '../lib/ContentContext'

export default function Doctors() {
  const { content, loading } = useContent()
  const doctors = content.doctors

  const scrollToBook = () => {
    document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section id="doctors" className="doctors">
        <div className="container">
          <h2 className="section-title">Our Medical Team</h2>
          <p className="section-subtitle">Loading doctors...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="doctors" className="doctors">
      <div className="container">
        <h2 className="section-title">Our Medical Team</h2>
        <p className="section-subtitle">
          Meet our experienced and dedicated healthcare professionals
        </p>
        {doctors.length === 0 ? (
          <div className="empty-state reveal">
            <p>Our team information will be available soon.</p>
          </div>
        ) : (
          <div className="doctors-grid reveal">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                {doctor.imageUrl && (
                  <img src={doctor.imageUrl} alt={doctor.name} className="doctor-image" />
                )}
                <h3>{doctor.name}</h3>
                <p className="specialty">{doctor.specialty}</p>
                <p className="bio">{doctor.bio}</p>
                <button className="cta-button" style={{ marginTop: '16px' }} onClick={scrollToBook}>
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
