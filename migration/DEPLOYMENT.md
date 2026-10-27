# Deployment record

- Date: 2026-10-27.
- Repository: https://github.com/mikegauci/knd-global
- Vercel project: `knd-global`, team `mikegaucis-projects`.
- Canonical production domain: https://www.knd-global.eu
- Eight bilingual marketing pages retain their original routes. The unlisted default post is retained with `noindex`.
- Hero video: compressed locally from approximately 8.1 MB to 1.0 MB. Autoplay, muted, looping, no video buttons. Reduced-motion settings pause it.
- Owner removed the Mailjet requirement. Original email and phone contacts are preserved; there is no contact-form backend and no site runtime credentials.
- The Cloudflare administration token remains in local, gitignored `.env`. It is not exposed to the client or uploaded as a site runtime secret.
- Local production build identified a footer path issue; corrected by importing the HTML as a build-time raw asset. Final production build is performed by the connected Vercel Git integration.
- Testing stopped at the owner's request after initial mobile visual and navigation review. No PageSpeed scores or email delivery have been tested or claimed.
- DNS snapshots are local under ignored `.vercel/`. DNS cutover modifies only the apex and www website records; all existing MX and SPF records are retained.
