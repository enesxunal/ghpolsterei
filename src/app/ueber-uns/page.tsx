import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { aboutPage } from "@/data/about";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: aboutPage.metadata.title,
  description: aboutPage.metadata.description,
  path: "/ueber-uns",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Startseite", path: "/" },
  { name: aboutPage.title, path: "/ueber-uns" },
]);

export default function UeberUnsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <AboutContent />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
