// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site. Update `site` to your GitHub username and `base`
  // to your repo name if they differ.
  site: 'https://avetavos.github.io',
  base: '/python-for-typescript-developers',
  output: 'static',
  integrations: [starlight({
      title: 'Python for TypeScript Developers',
      head: [
        { tag: 'script', attrs: { type: 'module', src: '/python-for-typescript-developers/enhance.js' } },
      ],
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        th: { label: 'ไทย', lang: 'th' },
      },
      customCss: ['./src/styles/custom.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/avetavos/python-for-typescript-developers' }],
      sidebar: [
        { label: 'Introduction & Setup', items: [{ autogenerate: { directory: 'intro' } }] },
        { label: 'Python 101 — Fundamentals', items: [{ autogenerate: { directory: 'python-101' } }] },
        { label: "Python You Won't Find in TypeScript", items: [{ autogenerate: { directory: 'py-only' } }] },
        { label: 'Async & Concurrency', items: [{ autogenerate: { directory: 'concurrency' } }] },
        { label: 'Building an API with FastAPI', items: [{ autogenerate: { directory: 'api-fastapi' } }] },
        { label: 'Advanced Python', items: [{ autogenerate: { directory: 'advanced' } }] },
        { label: 'Tooling, Testing & Deployment', items: [{ autogenerate: { directory: 'tooling' } }] },
      ],
      }), preact()],
});