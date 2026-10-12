import { AnimationProvider } from '@/components/motion/AnimationProvider';
import { Footer } from './Footer';
import { Header } from './Header';

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  return (
    <>
      <AnimationProvider>
        <Header />
        <main id="main-content">{children}</main>
      </AnimationProvider>
      <Footer />
    </>
  );
}
