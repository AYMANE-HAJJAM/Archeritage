import { Container } from '@/components/ui/Container';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

type ProjectGalleryProps = {
  title?: string;
  images: string[];
  projectTitle: string;
};

export function ProjectGallery({ title = 'Galerie', images, projectTitle }: ProjectGalleryProps) {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionLabel label="Images" title={title} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {images.map((image, index) => (
            <ImageReveal key={image} src={image} alt={`${projectTitle} - image ${index + 1}`} className={index === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'} fallbackLabel={projectTitle} />
          ))}
        </div>
      </Container>
    </section>
  );
}
