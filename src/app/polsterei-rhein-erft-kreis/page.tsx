import type { Metadata } from "next";
import {
  LocationRoutePage,
  buildLocationMetadata,
  requireLocationPage,
} from "@/components/content/LocationRoutePage";

const slug = "polsterei-rhein-erft-kreis";

export const metadata: Metadata = buildLocationMetadata(slug);

export default function PolstereiRheinErftKreisPage() {
  return <LocationRoutePage page={requireLocationPage(slug)} />;
}
