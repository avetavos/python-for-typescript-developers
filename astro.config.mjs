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
        { tag: 'link', attrs: { rel: 'manifest', href: '/python-for-typescript-developers/manifest.webmanifest' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/python-for-typescript-developers/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/python-for-typescript-developers/icon-192.png' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#FFD43B' } },
        { tag: 'meta', attrs: { name: 'mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: "Python for TypeScript Developers" } },
        { tag: 'script', content: "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/python-for-typescript-developers/sw.js',{scope:'/python-for-typescript-developers/'}).catch(function(){})})}" },
      ],
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        th: { label: 'ไทย', lang: 'th' },
      },
      customCss: ['./src/styles/custom.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/avetavos/python-for-typescript-developers' }],
      sidebar: [
        { label: 'Introduction & Setup', collapsed: true, items: [{ autogenerate: { directory: 'intro' } }] },
        { label: 'Python 101 — Fundamentals', collapsed: true, items: [{ autogenerate: { directory: 'python-101' } }] },
        { label: "Python You Won't Find in TypeScript", items: [{ autogenerate: { directory: 'py-only' } }] },
        { label: 'Async & Concurrency', collapsed: true, items: [{ autogenerate: { directory: 'concurrency' } }] },
        { label: 'Building an API with FastAPI', collapsed: true, items: [{ autogenerate: { directory: 'api-fastapi' } }] },
        { label: 'Advanced Python', collapsed: true, items: [{ autogenerate: { directory: 'advanced' } }] },
        { label: 'Tooling, Testing & Deployment', collapsed: true, items: [{ autogenerate: { directory: 'tooling' } }] },
      ],
      }), preact()],
});