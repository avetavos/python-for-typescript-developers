// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site. Update `site` to your GitHub username and `base`
  // to your repo name if they differ.
  site: 'https://avetavos.github.io',
  base: '/go-for-typescript-developers',
  output: 'static',
  integrations: [starlight({
      title: 'Go for TypeScript Developers',
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        th: { label: 'ไทย', lang: 'th' },
      },
      customCss: ['./src/styles/custom.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/avetavos/go-for-typescript-developers' }],
      sidebar: [
        { label: 'Introduction & Setup', items: [{ autogenerate: { directory: 'intro' } }] },
        { label: 'Go 101 — Fundamentals', items: [{ autogenerate: { directory: 'go-101' } }] },
        { label: "Go You Won't Find in TypeScript", items: [{ autogenerate: { directory: 'go-only' } }] },
        { label: 'Concurrency', items: [{ autogenerate: { directory: 'concurrency' } }] },
        { label: 'Building an API with Echo', items: [{ autogenerate: { directory: 'api-echo' } }] },
        { label: 'Advanced Go', items: [{ autogenerate: { directory: 'advanced' } }] },
        { label: 'Tooling, Testing & Deployment', items: [{ autogenerate: { directory: 'tooling' } }] },
      ],
      }), preact()],
});