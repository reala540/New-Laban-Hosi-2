import { upload } from '@vercel/blob/client'

export interface Banner {
  active: boolean
  message: string
  type: 'holiday' | 'offer' | 'info'
}

export interface Offer {
  id: string
  title: string
  description: string
  imageUrl?: string
  active: boolean
}

export interface ServiceItem {
  id: string
  name: string
  description: string
  icon: string
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  bio: string
  imageUrl?: string
}

export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  caption?: string
}

export interface SiteContent {
  banner: Banner
  offers: Offer[]
  services: ServiceItem[]
  doctors: Doctor[]
  gallery: GalleryItem[]
}

export const emptyContent: SiteContent = {
  banner: { active: false, message: '', type: 'info' },
  offers: [],
  services: [],
  doctors: [],
  gallery: []
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json()
    return data.error || fallback
  } catch {
    return fallback
  }
}

function adminHeaders(secret: string) {
  return { 'Content-Type': 'application/json', 'x-admin-key': secret }
}

// ---------------------------------------------------------------------------
// Public content (single combined fetch for the whole public site)
// ---------------------------------------------------------------------------

export async function fetchContent(): Promise<SiteContent> {
  const res = await fetch('/api/content')
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to load site content'))
  return res.json()
}

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

export async function saveBanner(banner: Banner, secret: string): Promise<void> {
  const res = await fetch('/api/banner', {
    method: 'PUT',
    headers: adminHeaders(secret),
    body: JSON.stringify(banner)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to save banner'))
}

// ---------------------------------------------------------------------------
// Offers
// ---------------------------------------------------------------------------

export async function createOffer(
  offer: Omit<Offer, 'id'>,
  secret: string
): Promise<Offer> {
  const res = await fetch('/api/offers', {
    method: 'POST',
    headers: adminHeaders(secret),
    body: JSON.stringify(offer)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to add offer'))
  return res.json()
}

export async function updateOffer(offer: Offer, secret: string): Promise<Offer> {
  const res = await fetch('/api/offers', {
    method: 'PUT',
    headers: adminHeaders(secret),
    body: JSON.stringify(offer)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to update offer'))
  return res.json()
}

export async function deleteOffer(id: string, secret: string): Promise<void> {
  const res = await fetch('/api/offers', {
    method: 'DELETE',
    headers: adminHeaders(secret),
    body: JSON.stringify({ id })
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to remove offer'))
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function createService(
  service: Omit<ServiceItem, 'id'>,
  secret: string
): Promise<ServiceItem> {
  const res = await fetch('/api/services', {
    method: 'POST',
    headers: adminHeaders(secret),
    body: JSON.stringify(service)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to add service'))
  return res.json()
}

export async function updateService(service: ServiceItem, secret: string): Promise<ServiceItem> {
  const res = await fetch('/api/services', {
    method: 'PUT',
    headers: adminHeaders(secret),
    body: JSON.stringify(service)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to update service'))
  return res.json()
}

export async function deleteService(id: string, secret: string): Promise<void> {
  const res = await fetch('/api/services', {
    method: 'DELETE',
    headers: adminHeaders(secret),
    body: JSON.stringify({ id })
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to remove service'))
}

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

export async function createDoctor(
  doctor: Omit<Doctor, 'id'>,
  secret: string
): Promise<Doctor> {
  const res = await fetch('/api/doctors', {
    method: 'POST',
    headers: adminHeaders(secret),
    body: JSON.stringify(doctor)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to add doctor'))
  return res.json()
}

export async function updateDoctor(doctor: Doctor, secret: string): Promise<Doctor> {
  const res = await fetch('/api/doctors', {
    method: 'PUT',
    headers: adminHeaders(secret),
    body: JSON.stringify(doctor)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to update doctor'))
  return res.json()
}

export async function deleteDoctor(id: string, secret: string): Promise<void> {
  const res = await fetch('/api/doctors', {
    method: 'DELETE',
    headers: adminHeaders(secret),
    body: JSON.stringify({ id })
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to remove doctor'))
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export async function createGalleryItem(
  item: { type: 'image' | 'video'; blobUrl: string; caption?: string },
  secret: string
): Promise<GalleryItem> {
  const res = await fetch('/api/gallery', {
    method: 'POST',
    headers: adminHeaders(secret),
    body: JSON.stringify(item)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to save gallery item'))
  return res.json()
}

export async function updateGalleryCaption(
  id: string,
  caption: string,
  secret: string
): Promise<GalleryItem> {
  const res = await fetch('/api/gallery', {
    method: 'PUT',
    headers: adminHeaders(secret),
    body: JSON.stringify({ id, caption })
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to update caption'))
  return res.json()
}

export async function deleteGalleryItem(id: string, secret: string): Promise<void> {
  const res = await fetch('/api/gallery', {
    method: 'DELETE',
    headers: adminHeaders(secret),
    body: JSON.stringify({ id })
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to remove gallery item'))
}

// ---------------------------------------------------------------------------
// Media upload (direct browser -> Blob, bypasses server body-size limits)
// ---------------------------------------------------------------------------

export async function uploadMedia(
  file: File,
  secret: string,
  onProgress?: (percentage: number) => void
): Promise<string> {
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    clientPayload: JSON.stringify({ secret }),
    onUploadProgress: onProgress ? (event) => onProgress(event.percentage) : undefined
  })
  return blob.url
}

// ---------------------------------------------------------------------------
// Appointments & contact messages
// ---------------------------------------------------------------------------

export interface Submission {
  id: string
  createdAt: string
  status: string
  [key: string]: unknown
}

export async function submitAppointment(payload: Record<string, unknown>): Promise<void> {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to book appointment'))
}

export async function submitMessage(payload: Record<string, unknown>): Promise<void> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to send message'))
}

export async function fetchAppointments(secret: string): Promise<Submission[]> {
  const res = await fetch('/api/appointments', { headers: { 'x-admin-key': secret } })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to load appointments'))
  return res.json()
}

export async function fetchMessages(secret: string): Promise<Submission[]> {
  const res = await fetch('/api/messages', { headers: { 'x-admin-key': secret } })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to load messages'))
  return res.json()
}

export async function updateAppointmentStatus(
  id: string,
  status: string,
  secret: string
): Promise<void> {
  const res = await fetch('/api/appointments', {
    method: 'PATCH',
    headers: adminHeaders(secret),
    body: JSON.stringify({ id, status })
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to update status'))
}

export async function updateMessageStatus(
  id: string,
  status: string,
  secret: string
): Promise<void> {
  const res = await fetch('/api/messages', {
    method: 'PATCH',
    headers: adminHeaders(secret),
    body: JSON.stringify({ id, status })
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to update status'))
}
