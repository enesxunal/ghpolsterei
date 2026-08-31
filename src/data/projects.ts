export type Project = {
  id: number;
  slug: string;
  image: string;
};

export const projects: Project[] = [
  { id: 4, slug: "projekt-04", image: "/images/projects/4.jpg" },
  { id: 10, slug: "projekt-10", image: "/images/projects/10.jpg" },
  { id: 11, slug: "projekt-11", image: "/images/projects/11.jpg" },
  { id: 12, slug: "projekt-12", image: "/images/projects/12.jpg" },
  { id: 8, slug: "projekt-08", image: "/images/projects/8.jpg" },
  { id: 5, slug: "projekt-05", image: "/images/projects/5.jpg" },
  { id: 7, slug: "projekt-07", image: "/images/projects/7.jpg" },
  { id: 2, slug: "projekt-02", image: "/images/projects/2.jpg" },
  { id: 3, slug: "projekt-03", image: "/images/projects/3.jpg" },
  { id: 1, slug: "projekt-01", image: "/images/projects/1.jpg" },
  { id: 6, slug: "projekt-06", image: "/images/projects/6.jpg" },
  { id: 9, slug: "projekt-09", image: "/images/projects/9.jpg" },
];

export const projectsPage = {
  title: "Projekte",
  heading: "Unsere Projekte",
  subheading: "Inspiration für Ihr nächstes Projekt",
  intro:
    "Von Polstermöbeln über Gastronomie-Sitzbänke bis zu Sattlerarbeiten — ein Einblick in abgeschlossene Arbeiten aus unserer Werkstatt in Wesseling.",
  metadata: {
    title: "Projekte — Polster- & Sattlerarbeiten",
    description:
      "Referenzprojekte der GH Polsterei in Wesseling: Polstermöbel, Gastronomie-Sitzbänke, Autositze und mehr — Handwerksqualität aus der Werkstatt.",
  },
} as const;

export function projectAltText(id: number) {
  return `Projekt ${id} — Polsterarbeit von GH Polsterei`;
}
