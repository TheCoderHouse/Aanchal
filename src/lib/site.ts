/**
 * Public URL of the site, used for the sitemap and link previews.
 * Uses NEXT_PUBLIC_SITE_URL if set, then the Vercel production address, then localhost.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3001");
