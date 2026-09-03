import type { Metadata } from "next";
import {
  LocationRoutePage,
  buildLocationMetadata,
  requireLocationPage,
} from "@/components/content/LocationRoutePage";

const slug = "polsterei-koeln";

export const metadata: Metadata = buildLocationMetadata(slug);

export default function PolstereiKoelnPage() {
  return <LocationRoutePage page={requireLocationPage(slug)} />;
}
