import createNextIntlPlugin from 'next-intl/plugin';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/services', destination: '/expertises', permanent: true },
      { source: '/en/services', destination: '/en/expertises', permanent: true },
      { source: '/ar/services', destination: '/ar/expertises', permanent: true },
      { source: '/projets', destination: '/references', permanent: true },
      { source: '/en/projets', destination: '/en/references', permanent: true },
      { source: '/ar/projets', destination: '/ar/references', permanent: true },
      { source: '/histoires', destination: '/journal', permanent: true },
      { source: '/en/histoires', destination: '/en/journal', permanent: true },
      { source: '/ar/histoires', destination: '/ar/journal', permanent: true },
      { source: '/mission', destination: '/missions', permanent: true },
      { source: '/en/mission', destination: '/en/missions', permanent: true },
      { source: '/ar/mission', destination: '/ar/missions', permanent: true },
      { source: '/fr', destination: '/', permanent: true },
      { source: '/fr/:path*', destination: '/:path*', permanent: true },
    ];
  },
  images: {
    qualities: [75, 80],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default (phase) => withNextIntl({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
