'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';

import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { motionTokens } from '@/lib/motion';

type Props = {
  eyebrow: string;
  title: string;
  introduction: string;
  primaryLabel: string;
  secondaryLabel: string;
  controls: { sliderLabel: string; imageOf: string; previousImage: string; nextImage: string; pause: string; play: string };
};

const heroFrames = [
  { src: '/images/references/tinmel-cover.jpg', desktop: '62% 52%', tablet: '66% 52%', mobile: '69% 48%' },
  { src: '/images/references/tiznit-cover.jpg', desktop: '58% 52%', tablet: '64% 52%', mobile: '68% 50%' },
  { src: '/images/references/diagnostic-cover.jpg', desktop: '63% 50%', tablet: '68% 50%', mobile: '72% 50%' },
  { src: '/images/hero/hero-urbanisme-foncier.jpg', desktop: '56% 48%', tablet: '58% 50%', mobile: '56% 50%' },
] as const;

/** A slow architectural sequence with manual controls and a stable reduced-motion mode. */
export function HomeHeroSlider({ eyebrow, title, introduction, primaryLabel, secondaryLabel, controls }: Props) {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [navigationEpoch, setNavigationEpoch] = useState(0);
  const [paused, setPaused] = useState(false);
  const showFrame = useCallback((index: number) => {
    setActiveIndex((index + heroFrames.length) % heroFrames.length);
    setNavigationEpoch((epoch) => epoch + 1);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(query.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion(); updateVisibility();
    query.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { query.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  useEffect(() => {
    if (reducedMotion || !pageVisible || paused) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % heroFrames.length), 7000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, pageVisible, navigationEpoch, paused]);

  useGSAP(
    () => {
      registerGsapPlugins();
      if (!root.current) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const copy = root.current.querySelectorAll('[data-hero-reveal]');
      const image = root.current.querySelector('[data-hero-media]');

      if (reduceMotion) {
        gsap.set(copy, { clearProps: 'all' });
        gsap.set(image, { clearProps: 'all' });
        return;
      }

      gsap.set(copy, { autoAlpha: 0, y: motionTokens.distance.hero });
      gsap.set(image, { scale: 1.035 });

      const timeline = gsap.timeline({ defaults: { ease: motionTokens.ease.major } });
      timeline
        .to(image, { scale: 1, duration: 1.5, ease: motionTokens.ease.crossfade }, 0)
        .to(copy, {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.duration.reveal,
          stagger: 0.09,
        }, 0.16);
    },
    { scope: root },
  );

  return (
    <header className="home-hero" ref={root}>
      <div className="home-hero__media" data-hero-media aria-hidden="true">
        {heroFrames.map((frame, index) => (
          <div className={`home-hero__frame${index === activeIndex ? ' is-active' : ''}`} key={frame.src} style={{ '--hero-position-desktop': frame.desktop, '--hero-position-tablet': frame.tablet, '--hero-position-mobile': frame.mobile } as React.CSSProperties}>
            <Image src={frame.src} alt="" fill priority={index === 0} loading={index === 0 ? 'eager' : 'lazy'} sizes="100vw" quality={80} />
          </div>
        ))}
      </div>
      <div className="home-hero__shade" aria-hidden="true" />

      <Container className="home-hero__inner">
        <div className="home-hero__content">
          <p className="eyebrow" data-hero-reveal>{eyebrow}</p>
          <h1 data-hero-reveal>{title}</h1>
          <p className="home-hero__intro" data-hero-reveal>{introduction}</p>
          <div className="home-hero__actions" data-hero-reveal>
            <Link className="button button--primary" href="/contact">
              {primaryLabel}
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button button--secondary" href="/methode">
              {secondaryLabel}
            </Link>
          </div>
        </div>
        <div className="home-hero__navigation" role="group" aria-label={controls.sliderLabel} data-hero-reveal>
          <button type="button" onClick={() => showFrame(activeIndex - 1)} aria-label={controls.previousImage}><ChevronLeft aria-hidden="true" /></button>
          <div className="home-hero__counter">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span><i><b key={`${activeIndex}-${navigationEpoch}`} className={reducedMotion || paused ? 'is-static' : ''} /></i><span>{String(heroFrames.length).padStart(2, '0')}</span>
            <span className="sr-only">{controls.imageOf.replace('{current}', String(activeIndex + 1)).replace('{total}', String(heroFrames.length))}</span>
          </div>
          <button type="button" onClick={() => showFrame(activeIndex + 1)} aria-label={controls.nextImage}><ChevronRight aria-hidden="true" /></button>
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? controls.play : controls.pause}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</button>
        </div>
        <div className="home-hero__scroll" aria-hidden="true"><i /><span>Scroll</span></div>
      </Container>
    </header>
  );
}
