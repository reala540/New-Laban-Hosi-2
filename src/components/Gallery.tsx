import { useEffect, useRef } from 'react'
import { useContent } from '../lib/ContentContext'

export default function Gallery() {
  const { content } = useContent()
  const items = content.gallery
  const viewportRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  const isCarousel = items.length > 1
  // Duplicate the list so the scroll can loop seamlessly once it reaches the halfway point.
  const trackItems = isCarousel ? [...items, ...items] : items

  useEffect(() => {
    if (!isCarousel) return
    const viewport = viewportRef.current
    if (!viewport) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let frame: number
    const speed = 0.6 // pixels per animation frame

    const step = () => {
      if (!pausedRef.current) {
        viewport.scrollLeft += speed
        const half = viewport.scrollWidth / 2
        if (viewport.scrollLeft >= half) {
          viewport.scrollLeft -= half
        }
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)

    const pause = () => { pausedRef.current = true }
    const resumeAfterDelay = () => {
      window.setTimeout(() => { pausedRef.current = false }, 1500)
    }

    viewport.addEventListener('mouseenter', pause)
    viewport.addEventListener('mouseleave', () => { pausedRef.current = false })
    viewport.addEventListener('touchstart', pause, { passive: true })
    viewport.addEventListener('touchend', resumeAfterDelay, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('mouseenter', pause)
      viewport.removeEventListener('touchstart', pause)
      viewport.removeEventListener('touchend', resumeAfterDelay)
    }
  }, [isCarousel, items.length])

  if (items.length === 0) {
    return (
      <section id="gallery" className="gallery">
        <div className="container">
          <h2 className="section-title">Photos &amp; Videos</h2>
          <p className="section-subtitle">A look inside The Laban Hospital</p>
          <div className="empty-state reveal">
            <p>New gallery photos and videos will appear here soon.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <h2 className="section-title">Photos &amp; Videos</h2>
        <p className="section-subtitle">A look inside The Laban Hospital</p>
      </div>
      <div className="gallery-viewport reveal" ref={viewportRef}>
        <div className={`gallery-track ${isCarousel ? '' : 'gallery-track-static'}`}>
          {trackItems.map((item, i) => (
            <div key={`${item.id}-${i}`} className="gallery-item">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.caption || ''} loading="lazy" />
              ) : (
                <video src={item.url} controls />
              )}
              {item.caption && <p className="gallery-caption">{item.caption}</p>}
            </div>
          ))}
        </div>
      </div>
      {isCarousel && <p className="gallery-hint container">Hover to pause &middot; swipe on mobile</p>}
    </section>
  )
}
