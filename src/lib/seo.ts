// Set the canonical origin explicitly in production; preview deployments stay noindex.
const configured =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://arrow-learn-games.vercel.app");
export const siteUrl = new URL(configured || "http://localhost:3000").origin;
export const indexable =
  process.env.NODE_ENV === "production" &&
  Boolean(configured) &&
  new URL(siteUrl).protocol === "https:" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
