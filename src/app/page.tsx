import type { Metadata } from "next";
import { CraftsmanshipTeaser } from "@/components/home/CraftsmanshipTeaser";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { homepage } from "@/data/homepage";
import { buildLocalBusinessJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: homepage.metadata.title,
  description: homepage.metadata.description,
  path: "/",
});

const localBusinessJsonLd = buildLocalBusinessJsonLd();

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <Hero />
        <TrustStrip />
        <ServicesSection />
        <ProjectsSection />
        <CraftsmanshipTeaser />
        <ProcessSection />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
