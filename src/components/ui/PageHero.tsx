import { Container } from './Container';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  supporting?: string;
  /** Single-column, tighter hero used by Cabinet */
  compact?: boolean;
};

export function PageHero({ eyebrow, title, introduction, supporting, compact = false }: PageHeroProps) {
  return (
    <header className={`page-hero${compact ? ' page-hero--compact' : ''}`} data-motion="hero">
      <Container>
        <div className="page-hero__heading">
          <p className="eyebrow" data-motion-eyebrow>{eyebrow}</p>
          <h1 data-motion-heading>{title}</h1>
          <span className="page-hero__rule" data-motion-line aria-hidden="true" />
        </div>
        <div className={`page-hero__copy${compact ? ' page-hero__copy--stack' : ''}`}>
          <p className="lede" data-motion-copy>{introduction}</p>
          {supporting ? <p data-motion-copy>{supporting}</p> : null}
        </div>
      </Container>
    </header>
  );
}
