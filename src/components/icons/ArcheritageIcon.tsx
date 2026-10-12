import type { LucideIcon } from 'lucide-react';
import {
  Archive,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  Clock3,
  FileCheck2,
  FileText,
  Focus,
  Gauge,
  Landmark,
  Layers3,
  Mail,
  Map,
  MapPin,
  Network,
  Phone,
  ScanSearch,
  Send,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  UsersRound,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export type ArcheritageIconName =
  | 'archive' | 'architecture' | 'calendar' | 'chart' | 'check' | 'clock'
  | 'document' | 'feasibility' | 'focus' | 'gauge' | 'governance' | 'heritage'
  | 'institution' | 'layers' | 'mail' | 'map' | 'map-pin' | 'network'
  | 'phone' | 'scan' | 'send' | 'shield-alert' | 'shield-check' | 'upload' | 'users';

export type ArcheritageIconVariant = 'inline' | 'card' | 'feature' | 'contact' | 'muted';
export type ArcheritageIconTone = 'current' | 'accent' | 'muted' | 'light';

const iconMap = {
  archive: Archive, architecture: Building2, calendar: CalendarDays, chart: ChartNoAxesCombined,
  check: Check, clock: Clock3, document: FileText, feasibility: FileCheck2, focus: Focus, gauge: Gauge,
  governance: Network, heritage: Landmark, institution: Landmark, layers: Layers3, mail: Mail,
  map: Map, 'map-pin': MapPin, network: Network, phone: Phone, scan: ScanSearch, send: Send,
  'shield-alert': ShieldAlert, 'shield-check': ShieldCheck, upload: UploadCloud, users: UsersRound,
} satisfies Record<ArcheritageIconName, LucideIcon>;

type ArcheritageIconProps = {
  name: ArcheritageIconName;
  variant?: ArcheritageIconVariant;
  tone?: ArcheritageIconTone;
  className?: string;
  label?: string;
};

export function ArcheritageIcon({ name, variant = 'inline', tone = 'current', className, label }: ArcheritageIconProps) {
  const Icon = iconMap[name];
  return (
    <span className={cn('archeritage-icon', `archeritage-icon--${variant}`, `archeritage-icon--${tone}`, className)} aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      <Icon strokeWidth="var(--icon-stroke)" focusable="false" />
    </span>
  );
}

export const clientProfileIcons = ['institution', 'map', 'architecture'] as const satisfies readonly ArcheritageIconName[];
export const pillarIcons = ['map', 'architecture', 'heritage'] as const satisfies readonly ArcheritageIconName[];
export const missionFormatIcons = ['scan', 'feasibility', 'users', 'shield-alert', 'governance'] as const satisfies readonly ArcheritageIconName[];
export const methodPrincipleIcons = ['focus', 'document', 'layers', 'shield-check', 'gauge', 'shield-alert', 'archive'] as const satisfies readonly ArcheritageIconName[];
