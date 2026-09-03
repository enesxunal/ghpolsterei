import type { Metadata } from "next";
import { EditorialArticle } from "@/components/content/EditorialArticle";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { profilePage } from "@/data/profile";
import { buildBreadcrumbJsonLd, buildLocalBusinessJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: profilePage.metadata.title,
  description: profilePage.metadata.description,
  path: "/gh-polsterei",
  ogImages: [
    {
      url: profilePage.heroImage.src,
      alt: profilePage.heroImage.alt,
    },
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Startseite", path: "/" },
  { name: profilePage.title, path: "/gh-polsterei" },
]);

const localBusinessJsonLd = buildLocalBusinessJsonLd();

export default function GhPolstereiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <EditorialArticle
          eyebrow={profilePage.eyebrow}
          heading={profilePage.heading}
          intro={profilePage.intro}
          breadcrumb={[
            { label: "Startseite", href: "/" },
            { label: profilePage.title },
          ]}
          heroImage={profilePage.heroImage}
          facts={profilePage.facts}
          sections={profilePage.sections}
          relatedLinks={profilePage.pageLinks}
          cta={profilePage.cta}
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
