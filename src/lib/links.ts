import { site } from "@/data/site";

export function getTelHref(): string {
  return `tel:${site.phone.replace(/\s/g, "")}`;
}

export function getMailtoHref(): string {
  return `mailto:${site.email}`;
}

export function getWhatsAppNumber(): string {
  return site.phone.replace(/\s/g, "").replace(/^0/, "49");
}

export function getWhatsAppHref(
  text = "Guten Tag, ich habe eine Anfrage zu GH Polsterei.",
): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(text)}`;
}
