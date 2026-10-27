import pages from '../content/pages.json';

const site = 'https://www.knd-global.eu';
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export const GET = () => {
  const urls = pages.map(page => {
    const italian = page.path === '/en/home/' ? '/' : page.path.startsWith('/en/') ? page.path.slice(3) : page.path;
    const english = italian === '/' ? '/en/home/' : `/en${italian}`;
    const alternatives = [['it', italian], ['en', english], ['x-default', italian]];
    return `<url><loc>${escape(site + page.path)}</loc>${alternatives.map(([language, path]) => `<xhtml:link rel="alternate" hreflang="${language}" href="${escape(site + path)}"/>`).join('')}</url>`;
  }).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/css" href="/sitemap.css"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
