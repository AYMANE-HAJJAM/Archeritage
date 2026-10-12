type SectionHeadingProps = { eyebrow?: string; title: string; text?: string; light?: boolean };

export function SectionHeading({ eyebrow, title, text, light = false }: SectionHeadingProps) {
  return (
    <div className={`section-heading${light ? ' section-heading--light' : ''}`}>
      <div>
        {eyebrow ? <p className="eyebrow" data-motion-eyebrow>{eyebrow}</p> : null}
        <h2 data-motion-heading>{title}</h2>
        <span className="section-heading__rule" data-motion-line aria-hidden="true" />
      </div>
      {text ? <p data-motion-copy>{text}</p> : null}
    </div>
  );
}
