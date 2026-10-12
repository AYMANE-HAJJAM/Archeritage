import { ArrowUpRight } from 'lucide-react';
import { getMessages } from 'next-intl/server';
import { ArcheritageIcon, clientProfileIcons } from '@/components/icons/ArcheritageIcon';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { clientSegments } from '@/content/site/client-segments';
import { Link } from '@/i18n/navigation';

type ClientsMessages = {
  eyebrow: string;
  title: string;
  text: string;
  segments: Record<string, { title: string; points: string[]; cta: string }>;
};

export async function ClientSegmentation() {
  const messages = (await getMessages()) as { home: { clients: ClientsMessages } };
  const clients = messages.home.clients;

  return (
    <section className="section section--ivory client-segmentation">
      <Container>
        <SectionHeading eyebrow={clients.eyebrow} title={clients.title} text={clients.text} />
        <div className="client-segment-grid">
          {clientSegments.map((segment, index) => {
            const slug = segment.href.split('=').pop() ?? '';
            const copy = clients.segments[slug];
            return (
              <article className="client-segment-card" key={segment.title} data-motion-item>
                <div className="client-segment-card__meta">
                  <span className="client-segment-card__icon-frame" aria-hidden="true">
                    <ArcheritageIcon name={clientProfileIcons[index]} variant="card" tone="accent" />
                  </span>
                  <span className="client-segment-card__index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{copy?.title ?? segment.title}</h3>
                <ul>{(copy?.points ?? segment.points).map((point) => <li key={point}>{point}</li>)}</ul>
                <Link href={segment.href}>{copy?.cta ?? segment.cta}<ArrowUpRight aria-hidden="true" /></Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
