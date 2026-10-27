# KND Global

Static Astro migration of https://www.knd-global.eu. Content, images, video, fonts and design CSS are stored in this repository. No WordPress, PHP, database, CMS, or live WordPress API is needed to build or serve the site.

## Development

```sh
npm ci
npm run dev
```

`npm run build` produces `dist/`. Vercel is connected to `mikegauci/knd-global`, production branch `main`, under `mikegaucis-projects`.

## Content and design

- `src/content/pages.json`: all eight Italian and English pages, retaining the existing URLs.
- `src/content/footer.html`: shared footer; English link destinations and introduction are supplied by the layout.
- `src/layouts/Layout.astro`: navigation, language switch, canonical URLs, page-specific SEO, social metadata and Organization/WebSite/WebPage structured data.
- `public/styles/`: original visual CSS extracted into ordinary local files, local font definitions and static navigation/accessibility refinements. Retained CSS class names are styling hooks, not CMS dependencies.
- `public/assets/`: local WebP images and responsive variants, WOFF2 fonts, compressed H.264 hero video, poster and social image.
- The hero video autoplays muted and loops without controls. Reduced-motion preferences pause it. Browser autoplay or power-saving policies can prevent automatic playback.
- Contact pages use `mailto:` and `tel:` links and a lazy Google Maps embed. **There are no contact forms or Mailjet integration**, following the owner's updated instruction.
- `vercel.json`: permanent redirects, security and cache headers. Old media URLs redirect to local assets; the broken English `/en/about-us-2/` link redirects to `/en/about-us/`.
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`: static SEO/discovery files. The sitemap includes the eight public pages only. The branded error page is excluded and marked `noindex`.

## Credentials and domain administration

`.env` is gitignored and should contain only the Cloudflare token needed for DNS administration. The website needs **no runtime credentials**. Do not upload the DNS administration token to Vercel's website environment variables.

Cloudflare DNS snapshots are kept in ignored `.vercel/dns-before.json` and `.vercel/dns-after.json`. The cutover changes only the apex and www web records. MX, SPF, and other records must remain unchanged. Canonical host: `www.knd-global.eu`; apex redirects permanently to www.

## Verification scope

Mobile homepage visual comparison and mobile menu interaction were performed during implementation. Contact email and phone destinations were inspected. Further testing was stopped at the owner's request. Production build and deployment status are recorded in `migration/DEPLOYMENT.md`. No PageSpeed score or email delivery is claimed.

The default “Hello world!” post is preserved at `/hello-world/` with `noindex` and excluded from the marketing sitemap. CMS system archives are not public marketing pages. Known WordPress page-ID query links redirect permanently to their retained URLs.
