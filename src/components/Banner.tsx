import { useState } from 'react'
import { useContent } from '../lib/ContentContext'

export default function Banner() {
  const { content } = useContent()
  const [dismissed, setDismissed] = useState(false)

  if (!content.banner?.active || !content.banner.message || dismissed) {
    return null
  }

  return (
    <div className={`announcement-banner banner-${content.banner.type}`}>
      <div className="container banner-content">
        <span>{content.banner.message}</span>
        <button
          className="banner-close"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
