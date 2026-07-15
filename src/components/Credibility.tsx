import { Stethoscope, Activity, Siren, HeartHandshake, Target, Eye, ShieldCheck, Users } from 'lucide-react'

const whyChooseUs = [
  {
    icon: Stethoscope,
    title: 'Qualified Specialists',
    text: 'Experienced healthcare professionals committed to your wellbeing.'
  },
  {
    icon: Activity,
    title: 'Modern Equipment',
    text: 'Reliable diagnostic and treatment technology for accurate care.'
  },
  {
    icon: Siren,
    title: '24/7 Emergency Care',
    text: 'Round-the-clock emergency response when you need it most.'
  },
  {
    icon: HeartHandshake,
    title: 'Compassionate Care',
    text: 'Patient-centered care delivered with dignity and respect.'
  }
]

const coreValues = [
  { icon: HeartHandshake, title: 'Compassion' },
  { icon: ShieldCheck, title: 'Integrity' },
  { icon: Target, title: 'Excellence' },
  { icon: Users, title: 'Teamwork' }
]

export default function Credibility() {
  return (
    <section id="why-us" className="credibility">
      <div className="container">
        <h2 className="section-title">Why Choose The Laban Hospital</h2>
        <p className="section-subtitle">What patients can expect every time they visit</p>

        <div className="why-us-grid reveal">
          {whyChooseUs.map((item) => (
            <div className="why-us-card" key={item.title}>
              <div className="why-us-icon">
                <item.icon size={28} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mission-vision-grid reveal">
          <div className="mv-card">
            <div className="mv-icon">
              <Target size={24} />
            </div>
            <h3>Our Mission</h3>
            <p>
              {/* Placeholder copy - replace with the hospital's official mission statement if one exists. */}
              To provide accessible, compassionate, and high-quality healthcare to every patient who
              walks through our doors &mdash; delivered with dignity, urgency, and care.
            </p>
          </div>
          <div className="mv-card">
            <div className="mv-icon">
              <Eye size={24} />
            </div>
            <h3>Our Vision</h3>
            <p>
              {/* Placeholder copy - replace with the hospital's official vision statement if one exists. */}
              To be the most trusted healthcare provider in Murang&apos;a County, recognized for
              clinical excellence and compassionate service.
            </p>
          </div>
        </div>

        <div className="core-values reveal">
          <h3 className="core-values-title">Our Core Values</h3>
          <div className="core-values-grid">
            {coreValues.map((v) => (
              <div className="core-value-pill" key={v.title}>
                <v.icon size={18} />
                <span>{v.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="director-message reveal">
          <div className="director-message-quote">
            <p>
              &ldquo;[Add a short welcome message from the hospital director here &mdash; a few
              sentences about the hospital&apos;s commitment to patients and the community.]&rdquo;
            </p>
            <div className="director-message-attr">
              <strong>[Director&apos;s Full Name]</strong>
              <span>[Director&apos;s Title]</span>
            </div>
          </div>
        </div>

        <p className="community-focus reveal">
          Proudly rooted in Murang&apos;a &ndash; Kaharati, we&apos;re committed to serving our
          community with accessible, compassionate healthcare &mdash; today and for generations to
          come.
        </p>
      </div>
    </section>
  )
}
