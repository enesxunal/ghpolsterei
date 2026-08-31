import { services } from "@/data/services";
import { site } from "@/data/site";

export const contactPage = {
  title: "Kontakt",
  heading: "Ihr Projekt. Unsere Handarbeit.",
  intro:
    "Sie möchten Polstermöbel neu beziehen, Autositze aufbereiten, ein Cabrio-Verdeck erneuern oder eine andere Polster- und Sattlerarbeit anfragen? Schreiben Sie uns — wir erstellen Ihnen gerne ein unverbindliches Angebot aus unserer Werkstatt in Wesseling.",
  formEyebrow: "Anfrage",
  formHeading: "Kostenloses Angebot anfragen",
  formIntro:
    "Schildern Sie kurz Ihr Vorhaben. Fotos helfen uns, Umfang und Material besser einzuschätzen.",
  metadata: {
    title: "Kontakt & Angebot anfragen | GH Polsterei Wesseling",
    description:
      "Kontaktieren Sie GH Polsterei in Wesseling: Angebot für Polstermöbel, Autositze, Cabrio-Verdecke und Sattlerarbeiten. Telefon, E-Mail oder Formular.",
  },
} as const;

export const contactServiceOptions = [
  ...services.map((service) => ({
    value: service.slug,
    label: service.title,
  })),
  { value: "allgemein", label: "Allgemeine Anfrage" },
] as const;

export const allowedServiceValues = contactServiceOptions.map(
  (option) => option.value,
);

export const contactAddressLine = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
