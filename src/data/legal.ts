import { site } from "@/data/site";

export const impressumPage = {
  title: "Impressum",
  heading: "Anbieterkennzeichnung",
  metadata: {
    title: "Impressum | GH Polsterei",
    description: `Anbieterkennzeichnung der ${site.name}, Inhaber ${site.owner}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}.`,
  },
} as const;

export const datenschutzPage = {
  title: "Datenschutz",
  heading: "Datenschutzerklärung",
  metadata: {
    title: "Datenschutzerklärung | GH Polsterei",
    description:
      "Informationen zur Verarbeitung personenbezogener Daten bei GH Polsterei: Kontaktformular, Hosting und Ihre Rechte nach der DSGVO.",
  },
} as const;

export const legalAddressLine = `${site.address.street}, ${site.address.postalCode} ${site.address.city}, ${site.address.country}`;
