import { Container } from '@/components/ui/Container';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { SectionLabel } from '@/components/ui/SectionLabel';

const values = [
  { title: 'Respect de l’existant', text: 'Préserver les traces, les matières et les qualités qui fondent la valeur du lieu.' },
  { title: 'Précision du diagnostic', text: 'Décider à partir d’une lecture historique, constructive et sanitaire documentée.' },
  { title: 'Intelligence du contexte local', text: 'Tenir compte des usages, des interlocuteurs, des règles et des réalités du territoire.' },
  { title: 'Dialogue avec les savoir-faire', text: 'Associer les compétences techniques et artisanales adaptées au bâti patrimonial.' },
  { title: 'Transmission et durabilité', text: 'Permettre au lieu de conserver son âme tout en retrouvant un usage viable.' },
];

export function ValuesSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionLabel label="Valeurs" title="Une méthode entre rigueur technique et sensibilité culturelle." />
        <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {values.map((value) => (
            <article key={value.title} className="surface-card rounded-[0.75rem] p-6" data-card>
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">{value.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{value.text}</p>
            </article>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
