import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AdminApp from './admin/AdminApp.tsx'

// Hidden admin route: visiting /manage/<secret> renders the content manager
// instead of the public site. The secret segment doubles as the key sent to
// the API - there's no separate login step.
const manageMatch = window.location.pathname.match(/^\/manage\/([^/]+)\/?$/)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {manageMatch ? <AdminApp secretKey={manageMatch[1]} /> : <App />}
  </StrictMode>,
)
