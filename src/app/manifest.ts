import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BJJHub",
    short_name: "BJJHub",
    description: "Sua academia em evolução",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#050609",
    theme_color: "#050609",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
