import { useEffect } from 'react'

/**
 * Fades/slides elements with class "reveal" into view as they enter the
 * viewport. Elements are queried once on mount; this covers every section
 * because each section's wrapper markup (even for content that loads later
 * from the API, like doctors or gallery) is present from the first render.
 */
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('reveal-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
