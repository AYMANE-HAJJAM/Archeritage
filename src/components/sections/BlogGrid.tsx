import { Container } from '@/components/ui/Container';
import { BlogCard } from '@/components/ui/BlogCard';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { posts } from '@/data/posts';

export function BlogGrid() {
  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <Container>
        <SectionLabel label="Journal" title="Diagnostic, investissement et valorisation patrimoniale." />
        <RevealGroup className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
