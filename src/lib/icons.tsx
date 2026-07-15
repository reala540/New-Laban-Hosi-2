import {
  Cross,
  ClipboardList,
  BedDouble,
  Baby,
  FlaskConical,
  Pill,
  ScanLine,
  Scissors,
  Stethoscope,
  type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  ambulance: Cross,
  clipboard: ClipboardList,
  bed: BedDouble,
  baby: Baby,
  flask: FlaskConical,
  pill: Pill,
  scan: ScanLine,
  scissors: Scissors,
  stethoscope: Stethoscope
}

/**
 * Renders a service icon. Known keys (set in code, e.g. the fallback service
 * list) render a crisp lucide icon. Anything else - including whatever an
 * admin types into the CMS icon field (often an emoji) - is rendered as-is,
 * so this never breaks content that already exists in the database.
 */
export function ServiceIcon({ icon }: { icon: string }) {
  const Comp = iconMap[icon.toLowerCase()]
  if (Comp) return <Comp size={34} strokeWidth={1.75} />
  return <span className="service-icon-fallback">{icon}</span>
}
