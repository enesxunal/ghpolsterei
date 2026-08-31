import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ServiceDetailContent } from "@/components/leistungen/ServiceDetailContent";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import {
  getServiceBySlug,
  leistungenPage,
  serviceSlugs,
} from "@/data/services";
import { site } from "@/data/site";
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  const isJpeg = /\.jpe?g$/i.test(service.image);

  return buildPageMetadata({
    title: service.seoTitle,
    description: service.metaDescription,
    path: `/leistungen/${service.slug}`,
    ogImages: isJpeg
      ? [
          {
            url: service.image,
            alt: service.imageAlt,
          },
        ]
      : undefined,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: leistungenPage.title, path: "/leistungen" },
    { name: service.title, path: `/leistungen/${service.slug}` },
  ]);

  const serviceJsonLd = buildServiceJsonLd({
    name: service.title,
    description: service.metaDescription,
    url: `${site.website}/leistungen/${service.slug}`,
    image: service.image,
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
        <ServiceDetailContent service={service} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
