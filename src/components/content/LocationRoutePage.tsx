import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialArticle } from "@/components/content/EditorialArticle";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import {
  getLocationPage,
  locationPages,
  type LocationPageContent,
} from "@/data/location-pages";
import { site } from "@/data/site";
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/seo";

type LocationRoutePageProps = {
  page: LocationPageContent;
};

export function LocationRoutePage({ page }: LocationRoutePageProps) {
  const path = `/${page.slug}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: page.title, path },
  ]);
  const serviceJsonLd = buildServiceJsonLd({
    name: page.heading,
    description: page.metadata.description,
    url: `${site.website}${path}`,
    image: page.heroImage.src,
    areaServed: locationAreaServed(page.slug),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <EditorialArticle
          eyebrow={page.eyebrow}
          heading={page.heading}
          intro={page.intro}
          breadcrumb={[
            { label: "Startseite", href: "/" },
            { label: page.title },
          ]}
          heroImage={page.heroImage}
          sections={page.sections}
          relatedLinks={page.relatedLinks}
          cta={page.cta}
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function locationAreaServed(slug: string) {
  if (slug === "polsterei-koeln") {
    return [
      { "@type": "City" as const, name: "Köln" },
      { "@type": "City" as const, name: "Wesseling" },
      { "@type": "State" as const, name: "Nordrhein-Westfalen" },
    ];
  }
  if (slug === "polsterei-bonn") {
    return [
      { "@type": "City" as const, name: "Bonn" },
      { "@type": "City" as const, name: "Wesseling" },
      { "@type": "AdministrativeArea" as const, name: "Rhein-Sieg-Kreis" },
      { "@type": "State" as const, name: "Nordrhein-Westfalen" },
    ];
  }
  return [
    { "@type": "AdministrativeArea" as const, name: "Rhein-Erft-Kreis" },
    { "@type": "City" as const, name: "Wesseling" },
    { "@type": "State" as const, name: "Nordrhein-Westfalen" },
  ];
}

export function buildLocationMetadata(slug: string): Metadata {
  const page = getLocationPage(slug);
  if (!page) return {};
  const isJpeg = /\.jpe?g$/i.test(page.heroImage.src);
  return buildPageMetadata({
    title: page.metadata.title,
    description: page.metadata.description,
    path: `/${page.slug}`,
    ogImages: isJpeg
      ? [{ url: page.heroImage.src, alt: page.heroImage.alt }]
      : undefined,
  });
}

export function requireLocationPage(slug: string): LocationPageContent {
  const page = getLocationPage(slug);
  if (!page) notFound();
  return page;
}

export const locationSlugs = locationPages.map((page) => page.slug);
