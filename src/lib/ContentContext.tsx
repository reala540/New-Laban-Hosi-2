import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchContent, emptyContent, type SiteContent } from './api'

interface ContentContextValue {
  content: SiteContent
  loading: boolean
  reload: () => void
}

const ContentContext = createContext<ContentContextValue>({
  content: emptyContent,
  loading: true,
  reload: () => {}
})

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(emptyContent)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetchContent()
      .then(setContent)
      .catch(() => setContent(emptyContent))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <ContentContext.Provider value={{ content, loading, reload: load }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}
