import { useContent } from '../lib/ContentContext'

export default function Offers() {
  const { content } = useContent()
  const activeOffers = content.offers.filter((offer) => offer.active)

  return (
    <section id="offers" className="offers">
      <div className="container">
        <h2 className="section-title">Current Offers</h2>
        <p className="section-subtitle">
          Special promotions and health awareness days
        </p>
        {activeOffers.length === 0 ? (
          <div className="empty-state reveal">
            <p>No current offers &mdash; check back soon for promotions and health awareness days.</p>
          </div>
        ) : (
          <div className="offers-grid reveal">
            {activeOffers.map((offer) => (
              <div key={offer.id} className="offer-card">
                {offer.imageUrl && (
                  <img src={offer.imageUrl} alt={offer.title} className="offer-image" />
                )}
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
