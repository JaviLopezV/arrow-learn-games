import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Arrow Learn Games",
    short_name: "Arrow Learn",
    description: "Aprende jugando · Aprèn jugant · Learn through play",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fcfbf8",
    theme_color: "#4552d5",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
