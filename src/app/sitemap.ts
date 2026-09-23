import type { MetadataRoute } from "next";
import { locales } from "@/i18n/messages";
import { learningAreas } from "@/games/config/learningAreas";
import { topics } from "@/games/config/topics";
import { availableModes } from "@/games/config/gameModes";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/topics",
    "/games",
    ...learningAreas.map((a) => `/games/${a.id}`),
    ...topics.flatMap((t) => {
      const path = `/games/${t.area}/${t.id}`;
      return [path, ...availableModes(t).map((m) => `${path}/${m.id}`)];
    }),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
          ["x-default", `${siteUrl}/es${path}`],
        ]),
      },
    })),
  );
}
