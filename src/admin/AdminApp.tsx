import { useEffect, useState } from 'react'
import { Megaphone, Tag, Activity, Users, Image as ImageIcon, CalendarCheck, MessageSquare } from 'lucide-react'
import { fetchContent, emptyContent, type SiteContent } from '../lib/api'
import { ToastProvider } from './Toast'
import BannerEditor from './BannerEditor'
import OffersEditor from './OffersEditor'
import ServicesEditor from './ServicesEditor'
import DoctorsEditor from './DoctorsEditor'
import GalleryEditor from './GalleryEditor'
import SubmissionsPanel from './SubmissionsPanel'
import './admin.css'

type Tab = 'banner' | 'offers' | 'services' | 'doctors' | 'gallery' | 'appointments' | 'messages'

const TABS: { id: Tab; label: string; icon: typeof Megaphone }[] = [
  { id: 'banner', label: 'Banner', icon: Megaphone },
  { id: 'offers', label: 'Offers', icon: Tag },
  { id: 'services', label: 'Services', icon: Activity },
  { id: 'doctors', label: 'Doctors', icon: Users },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
  { id: 'messages', label: 'Messages', icon: MessageSquare }
]

interface Props {
  secretKey: string
}

export default function AdminApp({ secretKey }: Props) {
  return (
    <ToastProvider>
      <AdminShell secretKey={secretKey} />
    </ToastProvider>
  )
}

function AdminShell({ secretKey }: Props) {
  const [content, setContent] = useState<SiteContent>(emptyContent)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [tab, setTab] = useState<Tab>('banner')

  useEffect(() => {
    fetchContent()
      .then(setContent)
      .catch(() => setLoadError('Could not load site content. Try refreshing the page.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="admin-shell admin-loading">Loading admin panel…</div>
  }

  if (loadError) {
    return (
      <div className="admin-shell admin-loading">
        <p className="admin-status error">{loadError}</p>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>The Laban Hospital — Content Manager</h1>
        <p>Keep this link private. Anyone with it can edit the site.</p>
      </header>

      <nav className="admin-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <main className="admin-main">
        {/* Each editor below manages its own list and saves each add/edit/
            delete immediately against its own endpoint - there's no single
            "Save everything" button anymore, so nothing can go stale between
            what the admin sees and what's actually stored. */}
        {tab === 'banner' && <BannerEditor banner={content.banner} secretKey={secretKey} />}
        {tab === 'offers' && <OffersEditor offers={content.offers} secretKey={secretKey} />}
        {tab === 'services' && <ServicesEditor services={content.services} secretKey={secretKey} />}
        {tab === 'doctors' && <DoctorsEditor doctors={content.doctors} secretKey={secretKey} />}
        {tab === 'gallery' && <GalleryEditor gallery={content.gallery} secretKey={secretKey} />}
        {tab === 'appointments' && <SubmissionsPanel secretKey={secretKey} kind="appointment" />}
        {tab === 'messages' && <SubmissionsPanel secretKey={secretKey} kind="message" />}
      </main>
    </div>
  )
}
