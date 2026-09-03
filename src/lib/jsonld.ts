import { areaServedPlaces } from "@/data/regions";
import { site } from "@/data/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type AreaServedPlace = {
  "@type": "City" | "AdministrativeArea" | "State";
  name: string;
};

const logoUrl = `${site.website}${site.brand.logoColor}`;
const workshopImageUrl = `${site.website}/images/legacy/photo-texture-sofa-upholstery.jpg`;

function buildAreaServed(places = areaServedPlaces): AreaServedPlace[] {
  return places.map((place) => ({
    "@type": place.type,
    name: place.name,
  }));
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? site.website : `${site.website}${item.path}`,
    })),
  };
}

export function buildServiceJsonLd({
  name,
  description,
  url,
  image,
  areaServed,
}: {
  name: string;
  description: string;
  url: string;
  image: string;
  areaServed?: AreaServedPlace[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    image: `${site.website}${image}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${site.website}/#localbusiness`,
      name: site.name,
      telephone: site.phone.replace(/\s/g, ""),
      email: site.email,
      url: site.website,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        postalCode: site.address.postalCode,
        addressLocality: site.address.city,
        addressCountry: "DE",
      },
    },
    areaServed: areaServed ?? buildAreaServed(),
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.website}/#localbusiness`,
    name: site.name,
    description: site.servicesIntro,
    url: site.website,
    telephone: site.phone.replace(/\s/g, ""),
    email: site.email,
    image: workshopImageUrl,
    logo: logoUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: "DE",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    areaServed: buildAreaServed(),
  };
}
