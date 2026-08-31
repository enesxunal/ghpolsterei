import type { MetadataRoute } from "next";
import { serviceSlugs } from "@/data/services";
import { site } from "@/data/site";

const indexablePaths = [
  "/",
  "/ueber-uns",
  "/leistungen",
  ...serviceSlugs.map((slug) => `/leistungen/${slug}`),
  "/projekte",
  "/kontakt",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePaths.map((path) => ({
    url: path === "/" ? site.website : `${site.website}${path}`,
  }));
}
