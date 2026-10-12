# ARCHERITAGE

Moroccan heritage architecture website for restoration, rehabilitation, cultural valorization, and investor support, built with Next.js App Router, TypeScript, Tailwind CSS, GSAP, Lenis, React Hook Form, and Zod.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint

## Structure

- `src/app` - routes, layout, metadata, and page entry points
- `src/components` - reusable layout, section, and UI components
- `src/data` - navigation, expertises, references, journal posts, footer, process, stats, and team data
- `src/hooks` - Lenis and GSAP helpers
- `src/lib` - shared utilities and metadata helpers
- `public/images` - placeholder asset folders for future project imagery

## Notes

- All imagery paths are safe placeholders and fall back to styled blocks when an asset is missing.
- The site is fully static at build time aside from the contact form interaction on the client.
