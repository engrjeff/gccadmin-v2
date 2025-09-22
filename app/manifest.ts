import type { MetadataRoute } from "next";
import { app } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: app.bgColor,
    background_color: app.bgColor,
    icons: [
      {
        src: "/assets/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/assets/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/assets/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    orientation: "portrait",
    display: "standalone",
    dir: "auto",
    lang: "en-US",
    name: app.title,
    short_name: app.title,
    description: app.description,
    start_url: "/",
    categories: ["productivity"],
  };
}
