import { Building2, ClipboardCheck, Landmark, Map, Network, ShieldCheck } from 'lucide-react';

export type InterventionIconName = 'architecture' | 'heritage' | 'urbanism' | 'complex' | 'amo' | 'governance';

const icons = {
  architecture: Building2,
  heritage: Landmark,
  urbanism: Map,
  complex: Network,
  amo: ClipboardCheck,
  governance: ShieldCheck,
} satisfies Record<InterventionIconName, typeof Building2>;

export function InterventionIcon({ name }: { name: InterventionIconName }) {
  const Icon = icons[name];

  return (
    <div className="intervention-icon" aria-hidden="true">
      <div className="intervention-icon__frame" />
      <Icon strokeWidth={1.25} />
    </div>
  );
}
