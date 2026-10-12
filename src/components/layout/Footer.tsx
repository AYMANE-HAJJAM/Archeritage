import { ArrowUpRight, Instagram, Linkedin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { ArcheritageIcon } from '@/components/icons/ArcheritageIcon';
import { FooterMotion } from '@/components/motion/FooterMotion';
import { Container } from '@/components/ui/Container';
import { SiteLogo } from '@/components/ui/SiteLogo';
import { contactDetails, contactLinks } from '@/content/site/contact-details';
import { siteRoutes } from '@/content/site/navigation';
import { Link } from '@/i18n/navigation';

export async function Footer() {
  const t = await getTranslations('common');
  const tNav = await getTranslations('navigation');

  return (
    <FooterMotion>
      <footer className="site-footer">
        <Container>
          <div className="site-footer__logo">
            <Link href="/" aria-label={t('homeAria')} className="site-footer__logo-link">
              <SiteLogo variant="footer" />
            </Link>
          </div>
          <span className="site-footer__rule" aria-hidden="true" />
          <div className="site-footer__grid">
            <div>
              <p className="eyebrow">{t('architecturePractice')}</p>
              <p className="site-footer__statement">{t('footerStatement')}</p>
            </div>
            <nav aria-label={t('footerNavigation')}>
              {siteRoutes.map((route, index) => (
                <Link key={route.href} href={route.href}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {tNav(route.key)}
                  <ArrowUpRight className="h-3.5 w-3.5 language-directional-icon" />
                </Link>
              ))}
            </nav>
            <div className="site-footer__contact">
              <p className="eyebrow">{tNav('contact')}</p>
              <a href={contactLinks.email} className="footer-contact-line" dir="ltr">
                <ArcheritageIcon name="mail" tone="light" />
                {contactDetails.email}
              </a>
              <a href={contactLinks.phone} className="footer-contact-line" dir="ltr">
                <ArcheritageIcon name="phone" tone="light" />
                {contactDetails.phoneDisplay}
              </a>
              <address className="footer-contact-line">
                <ArcheritageIcon name="map-pin" tone="light" />
                <span>
                  {contactDetails.addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </address>
              <Link href="/contact" className="arrow-link">
                {t('discussProject')}
                <ArrowUpRight className="h-4 w-4 language-directional-icon" />
              </Link>
              <div className="footer-legal">
                <Link href="/mentions-legales">{t('legalMentions')}</Link>
                <Link href="/confidentialite">{t('privacyPolicy')}</Link>
              </div>
              <div className="site-footer__socials" aria-label="Social media">
                <a href="https://www.linkedin.com/company/archeritage-ma/" target="_blank" rel="noreferrer" aria-label="ARCHERITAGE on LinkedIn"><Linkedin aria-hidden="true" /></a>
                <a href="https://www.instagram.com/archeritage.ma/" target="_blank" rel="noreferrer" aria-label="ARCHERITAGE on Instagram"><Instagram aria-hidden="true" /></a>
              </div>
            </div>
          </div>
          <div className="site-footer__bottom">
            <p>
              <bdi>ARCHERITAGE</bdi>
            </p>
            <p>
              {contactDetails.city}, {contactDetails.country}
            </p>
            <p>
              © {new Date().getFullYear()} <bdi>ARCHERITAGE</bdi>
            </p>
          </div>
        </Container>
      </footer>
    </FooterMotion>
  );
}
