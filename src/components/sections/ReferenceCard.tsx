import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import type { ReferenceRecord } from '@/content/site/references';
import { referenceHasDetailPage } from '@/content/site/references';
import { Link } from '@/i18n/navigation';

type ReferenceCardProps = {
  reference: ReferenceRecord;
  href?: string;
  index: number;
  variant?: 'home' | 'index';
  /** Localized copy overriding the base (French) record fields. */
  title?: string;
  summary?: string;
  attribution?: string;
  role?: string;
  missionType?: string;
  imageAlt?: string;
  listingOnlyLabel?: string;
};

export async function ReferenceCard({
  reference,
  href,
  index,
  variant = 'index',
  title,
  summary,
  attribution,
  role,
  missionType,
  imageAlt,
  listingOnlyLabel,
}: ReferenceCardProps) {
  const t = await getTranslations('common');
  const Heading = variant === 'index' ? 'h2' : 'h3';
  const imageSizes = variant === 'index'
    ? '(max-width: 767px) 100vw, 50vw'
    : '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw';
  const hasDetail = referenceHasDetailPage(reference) && Boolean(href);
  const resolvedTitle = title ?? reference.title;
  const resolvedSummary = summary ?? reference.summary;
  const resolvedAttribution = attribution ?? reference.attribution;
  const resolvedRole = role ?? reference.role;
  const resolvedMissionType = missionType ?? reference.missionType;
  const resolvedImageAlt = imageAlt ?? reference.imageAlt ?? resolvedTitle;
  const resolvedStatusLabel = reference.statusLabel ? (listingOnlyLabel ?? reference.statusLabel) : undefined;

  const card = (
    <article
      className={`reference-card reference-card--${variant}${reference.image ? '' : ' reference-card--no-image'}${hasDetail ? '' : ' reference-card--listing-only'}`}
      data-motion-item
    >
      {reference.image ? (
        <div className="reference-card__media" data-motion-media data-motion-dir={index % 2 === 0 ? 'right' : 'left'}>
          <Image src={reference.image} alt={resolvedImageAlt} fill sizes={imageSizes} />
        </div>
      ) : (
        <div className="reference-card__surface" aria-hidden="true">
          <span className="reference-card__surface-grid" />
          <span className="reference-card__surface-mark">ARCHERITAGE</span>
        </div>
      )}
      <div className="reference-card__body" data-motion-body>
        <div className="reference-card__meta">
          <span className="reference-card__index">{String(index + 1).padStart(2, '0')}</span>
          {reference.location ? <span className="reference-card__location">{reference.location}</span> : null}
        </div>
        {resolvedStatusLabel ? (
          <p className="reference-card__status">{resolvedStatusLabel}</p>
        ) : null}
        <Heading>{resolvedTitle}</Heading>
        {reference.institution ? <p className="reference-card__institution">{reference.institution}</p> : null}
        <p className="reference-card__facts">
          <span>{resolvedMissionType}</span>
          <span>{resolvedRole}</span>
        </p>
        <p className="reference-card__summary">{resolvedSummary}</p>
        <p className="reference-card__attribution">{resolvedAttribution}</p>
        {hasDetail ? (
          <span className="reference-card__cta">{t('discoverReference')} <ArrowUpRight aria-hidden="true" /></span>
        ) : (
          <span className="reference-card__cta reference-card__cta--muted">{listingOnlyLabel ?? resolvedStatusLabel}</span>
        )}
      </div>
    </article>
  );

  if (!hasDetail) {
    return <div className={`reference-card-link reference-card-link--${variant} reference-card-link--static`}>{card}</div>;
  }

  return (
    <Link className={`reference-card-link reference-card-link--${variant}`} href={href!} aria-label={t('discoverReferenceOf', { title: resolvedTitle })}>
      {card}
    </Link>
  );
}
