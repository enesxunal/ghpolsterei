export const regionNav = [
  { label: "Wesseling & NRW", href: "/einsatzgebiet" },
  { label: "Polsterei Köln", href: "/polsterei-koeln" },
  { label: "Polsterei Bonn", href: "/polsterei-bonn" },
  { label: "Rhein-Erft-Kreis", href: "/polsterei-rhein-erft-kreis" },
] as const;

export const areaServedPlaces = [
  { type: "City" as const, name: "Wesseling" },
  { type: "AdministrativeArea" as const, name: "Rhein-Erft-Kreis" },
  { type: "City" as const, name: "Köln" },
  { type: "City" as const, name: "Bonn" },
  { type: "State" as const, name: "Nordrhein-Westfalen" },
] as const;

export type RegionPlace = {
  name: string;
  note?: string;
  href?: string;
};

export const einzugsgebietPlaces: RegionPlace[] = [
  { name: "Wesseling", note: "Werkstatt", href: "/gh-polsterei" },
  { name: "Köln", href: "/polsterei-koeln" },
  { name: "Bonn", href: "/polsterei-bonn" },
  { name: "Rhein-Erft-Kreis", href: "/polsterei-rhein-erft-kreis" },
  { name: "Brühl", href: "/polsterei-rhein-erft-kreis" },
  { name: "Hürth", href: "/polsterei-rhein-erft-kreis" },
  { name: "Bornheim", href: "/polsterei-bonn" },
  { name: "Frechen", href: "/polsterei-rhein-erft-kreis" },
  { name: "Erftstadt", href: "/polsterei-rhein-erft-kreis" },
  { name: "Pulheim", href: "/polsterei-rhein-erft-kreis" },
  { name: "Rhein-Sieg-Kreis", href: "/polsterei-bonn" },
  { name: "Nordrhein-Westfalen" },
];
