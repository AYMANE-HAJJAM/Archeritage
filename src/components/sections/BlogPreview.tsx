import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BlogCard } from '@/components/ui/BlogCard';
import { Reveal } from '@/components/ui/Reveal';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { posts } from '@/data/posts';

export function BlogPreview() {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionLabel label="Journal" title="Repères pour comprendre le patrimoine et l’investissement au Maroc" />
          <Reveal delay={0.12}>
            <Button href="/histoires" variant="secondary">
              Lire le journal <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>
        </div>
        <RevealGroup className="mt-10 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
