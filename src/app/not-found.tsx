import Link from 'next/link';

import { Container } from '@/components/ui/Container';

/**
 * Global, locale-agnostic fallback. This only renders outside the `[locale]`
 * segment tree (e.g. truly unroutable paths), so it avoids `next-intl`
 * hooks/components — the catch-all under `[locale]/[...rest]` handles every
 * in-app 404 with the localized `[locale]/not-found.tsx` instead. Uses plain
 * `next/link` (not the locale-aware helper) since there's no intl context here.
 */
export default function NotFound() {
  return (
    <section className="not-found">
      <Container>
        <p className="eyebrow">Erreur 404</p>
        <h1>La page demandée est introuvable.</h1>
        <p>
          Le lien peut avoir changé ou la ressource n’existe plus. Retournez à l’accueil pour reprendre la navigation.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link className="button button--primary" href="/">Retour à l&apos;accueil</Link>
          <Link className="button button--secondary" href="/contact">Contactez-nous</Link>
        </div>
      </Container>
    </section>
  );
}
