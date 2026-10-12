import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import type { Pillar } from '@/content/site/official';
import { Link } from '@/i18n/navigation';

type PillarCardProps = {
  pillar: Pillar;
  index: number;
  detailed?: boolean;
  headingLevel?: 'h2' | 'h3';
};

export async function PillarCard({ pillar, index, detailed = false, headingLevel = 'h3' }: PillarCardProps) {
  const t = await getTranslations('common');
  const discoverLabel = t('discoverExpertiseOf', { title: pillar.title });
  const Heading = headingLevel;
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <article className={`pillar-card${detailed ? ' pillar-card--detailed' : ''}`} data-motion-item>
      <div
        className="pillar-card__media"
        data-motion-media
        data-motion-dir={index % 2 === 0 ? 'right' : 'left'}
        style={{ '--pillar-image-position': pillar.imagePosition ?? 'center' } as CSSProperties}
      >
        <Image src={pillar.image} alt={pillar.imageAlt ?? ''} fill sizes="(max-width: 1023px) 100vw, 33vw" />
        {!detailed ? <span aria-hidden="true">{indexLabel}</span> : null}
      </div>
      <div className="pillar-card__body" data-motion-body>
        {detailed ? <span className="pillar-card__index">{indexLabel}</span> : null}
        <Heading>{pillar.title}</Heading>
        <p>{pillar.description}</p>
        {detailed ? (
          <>
            <ol>
              {pillar.competencies.map((item, itemIndex) => (
                <li key={item}>
                  <span>{String(itemIndex + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
            <div className="pillar-card__actions">
              <Link
                href={pillar.href}
                className="pillar-card__detail-link"
                aria-label={discoverLabel}
              >
                {t('discoverExpertise')} <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <Link href={pillar.href} aria-label={discoverLabel}>
            {t('discoverExpertise')} <ArrowUpRight aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}
