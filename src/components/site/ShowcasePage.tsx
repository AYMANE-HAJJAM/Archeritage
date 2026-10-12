import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { PageMotion } from '@/components/motion/PageMotion';
import type { SitePage, SiteSection } from '@/content/site';
import { cn } from '@/lib/utils';

function SectionCards({ section }: { section: SiteSection }) {
  if (!section.cards?.length) return null;

  return (
    <div className={cn('site-card-grid', section.variant === 'steps' && 'site-card-grid--steps', section.variant === 'split' && 'site-card-grid--split')}>
      {section.cards.map((card, index) => (
        <article key={card.title} className="site-info-card">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          {card.points?.length ? <ul>{card.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
        </article>
      ))}
    </div>
  );
}

function PageSection({ section, index }: { section: SiteSection; index: number }) {
  return (
    <section className={cn('showcase-section', index % 2 === 1 && 'showcase-section--tinted')}>
      <Container>
        <div className="showcase-section__intro">
          <div><p className="eyebrow">{section.eyebrow ?? String(index + 1).padStart(2, '0')}</p><h2>{section.title}</h2></div>
          {section.introduction ? <p>{section.introduction}</p> : null}
        </div>
        <SectionCards section={section} />
        {section.points?.length ? (
          <div className="site-point-list">{section.points.map((point) => <div key={point}><ArrowRight className="h-4 w-4" /><span>{point}</span></div>)}</div>
        ) : null}
      </Container>
    </section>
  );
}

export function ShowcasePage({ page }: { page: SitePage }) {
  return (
    <PageMotion>
      <header className="showcase-hero">
        <div className="showcase-hero__grid" />
        <Container className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="showcase-hero__intro">{page.introduction}</p>
          </div>
          {page.statement ? <div className="showcase-statement"><span>ARCHERITAGE</span><p>{page.statement}</p></div> : null}
        </Container>
      </header>
      {page.sections.map((section, index) => <PageSection key={section.title} section={section} index={index} />)}
      <section className="showcase-cta-wrap"><Container><div className="contact-cta"><div><p className="eyebrow">Contact</p><h2>{page.cta.title}</h2><p>{page.cta.text}</p></div><Link href={page.cta.href} className="button-primary shrink-0">{page.cta.label}<ArrowRight className="h-4 w-4" /></Link></div></Container></section>
    </PageMotion>
  );
}
