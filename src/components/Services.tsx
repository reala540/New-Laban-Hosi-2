import { useContent } from '../lib/ContentContext'
import { ServiceIcon } from '../lib/icons'

const fallbackServices = [
  { id: 'svc-1', name: 'Accident & Emergency', description: 'Round-the-clock emergency medical care for all critical conditions', icon: 'ambulance' },
  { id: 'svc-2', name: 'Outpatient Services', description: 'Consultation and treatment without hospital admission', icon: 'clipboard' },
  { id: 'svc-3', name: 'Inpatient Admission', description: 'Comfortable ward facilities with 24/7 medical supervision', icon: 'bed' },
  { id: 'svc-4', name: 'Maternity Services', description: 'Complete prenatal, delivery, and postnatal care', icon: 'baby' },
  { id: 'svc-5', name: 'Laboratory Services', description: 'Advanced diagnostic testing and medical analysis', icon: 'flask' },
  { id: 'svc-6', name: 'Pharmacy', description: 'Complete medication dispensary with expert consultation', icon: 'pill' },
  { id: 'svc-7', name: 'Radiology', description: 'Modern imaging services including X-ray and ultrasound', icon: 'scan' },
  { id: 'svc-8', name: 'Surgery', description: 'Minor and major surgical procedures with experienced surgeons', icon: 'scissors' }
]

export default function Services() {
  const { content } = useContent()
  const services = content.services.length > 0 ? content.services : fallbackServices

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Comprehensive medical services designed to meet all your healthcare needs
        </p>
        <div className="services-grid reveal">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <ServiceIcon icon={service.icon} />
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
