import type { Metadata } from "next";
import {
  LocationRoutePage,
  buildLocationMetadata,
  requireLocationPage,
} from "@/components/content/LocationRoutePage";

const slug = "polsterei-bonn";

export const metadata: Metadata = buildLocationMetadata(slug);

export default function PolstereiBonnPage() {
  return <LocationRoutePage page={requireLocationPage(slug)} />;
}
