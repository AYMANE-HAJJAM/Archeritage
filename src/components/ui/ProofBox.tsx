type ProofBoxProps = { eyebrow: string; title: string; children: React.ReactNode; accent?: string };

export function ProofBox({ eyebrow, title, children, accent }: ProofBoxProps) {
  return <aside className={`proof-box${accent ? ' proof-box--accent' : ''}`}>
    <div className="proof-box__heading">
      <p className="eyebrow">{eyebrow}</p>
      {accent ? <strong>{accent}</strong> : <h2>{title}</h2>}
    </div>
    <div className="proof-box__content">
      {accent ? <h2>{title}</h2> : null}
      <div className="proof-box__copy">{children}</div>
    </div>
  </aside>;
}
