import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { BlogCard } from '@/components/ui/BlogCard';
import { Reveal } from '@/components/ui/Reveal';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { posts } from '@/data/posts';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types';

type BlogDetailContentProps = {
  post: Post;
};

export function BlogDetailContent({ post }: BlogDetailContentProps) {
  const relatedPosts = posts.filter((entry) => post.relatedPostSlugs.includes(entry.slug));

  return (
    <>
      <section className="py-20 sm:py-24 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionLabel label={post.category} title={post.title} />
            <p className="mt-5 text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{formatDate(post.date)}</p>
            <Reveal className="article mt-8 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base" stagger={0.08} childSelector="[data-article-paragraph]">
              {post.content.map((paragraph) => (
                <p key={paragraph} data-article-paragraph>{paragraph}</p>
              ))}
            </Reveal>
          </div>
          <Reveal className="surface-card rounded-[0.75rem] p-6 text-sm leading-7 text-[var(--muted)]">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">Lecture</p>
            <p className="mt-4">
              Cet article s’inscrit dans une lecture éditoriale du studio: des idées concrètes, une approche architecturale et une attention aux usages.
            </p>
          </Reveal>
        </Container>
      </section>

      {relatedPosts.length ? (
        <section className="py-20 sm:py-24 lg:py-28">
          <Container>
            <SectionLabel label="À lire aussi" title="Articles associés" />
            <RevealGroup className="mt-10 grid gap-6 lg:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}

      <section className="py-10 sm:py-14 lg:py-16">
        <Container>
          <Reveal>
            <Button href="/histoires" variant="secondary">
              Retour au journal
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
