import type { Metadata } from "next";
import { site } from "@/data/site";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogImages?: { url: string; alt: string }[];
};

export function canonicalUrl(path: string): string {
  if (path === "/") return site.website;
  return `${site.website}${path}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  noindex = false,
  ogImages,
}: PageSeoInput): Metadata {
  const url = canonicalUrl(path);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      locale: "de_DE",
      type: "website",
      siteName: site.name,
      ...(ogImages ? { images: ogImages } : {}),
    },
  };
}
