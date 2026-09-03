export type Project = {
  id: number;
  slug: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

const customer = "/images/projects/customer-2026";

export const projects: Project[] = [
  {
    id: 13,
    slug: "cabrio-verdeck-werkstatt-01",
    image: `${customer}/cabrio-verdeck-werkstatt-01.jpg`,
    alt: "Sattlerarbeit an einem schwarzen Cabrio-Verdeck in der Werkstatt",
    width: 1024,
    height: 743,
  },
  {
    id: 14,
    slug: "cabrio-verdeck-werkstatt-02",
    image: `${customer}/cabrio-verdeck-werkstatt-02.jpg`,
    alt: "Prüfung eines Cabrio-Verdecks in der GH Polsterei Werkstatt",
    width: 1024,
    height: 760,
  },
  {
    id: 15,
    slug: "cabrio-verdeck-werkstatt-03",
    image: `${customer}/cabrio-verdeck-werkstatt-03.jpg`,
    alt: "Arbeit am Verdeck eines roten Cabrios in der Werkstatt",
    width: 766,
    height: 995,
  },
  {
    id: 16,
    slug: "cabrio-verdeck-werkstatt-04",
    image: `${customer}/cabrio-verdeck-werkstatt-04.jpg`,
    alt: "Einbau der Heckscheibe an einem Cabrio-Verdeck",
    width: 767,
    height: 995,
  },
  {
    id: 17,
    slug: "cabrio-heckscheibe-reparatur",
    image: `${customer}/cabrio-heckscheibe-reparatur.jpg`,
    alt: "Heckscheibe eines Cabrio-Verdecks nach der fachgerechten Abdichtung",
    width: 1024,
    height: 1024,
  },
  {
    id: 18,
    slug: "motorradsitz-neubezug",
    image: `${customer}/motorradsitz-neubezug.jpg`,
    alt: "Motorradsitz mit neuem Schwarz-Rot-Bezug aus der Werkstatt",
    width: 1024,
    height: 1024,
  },
  {
    id: 19,
    slug: "ohrensessel-lederrestaurierung",
    image: `${customer}/ohrensessel-lederrestaurierung.jpg`,
    alt: "Ohrensessel mit neuem Lederbezug aus der Polsterei",
    width: 1024,
    height: 1024,
  },
  {
    id: 20,
    slug: "bugholzsessel-restaurierung",
    image: `${customer}/bugholzsessel-restaurierung.jpg`,
    alt: "Restaurierter Bugholzsessel mit floralem Stoffbezug",
    width: 1024,
    height: 1024,
  },
  {
    id: 21,
    slug: "stuhl-samt-restaurierung",
    image: `${customer}/stuhl-samt-restaurierung.jpg`,
    alt: "Restaurierter Stuhl mit rotem Samtbezug und Ziernägeln",
    width: 1024,
    height: 1024,
  },
  {
    id: 22,
    slug: "ergonomiestuhl-neubezug",
    image: `${customer}/ergonomiestuhl-neubezug.jpg`,
    alt: "Ergonomiestuhl nach dem Neubezug in schwarzem Leder",
    width: 1024,
    height: 1024,
  },
  {
    id: 23,
    slug: "fahrzeug-innenverkleidung",
    image: `${customer}/fahrzeug-innenverkleidung.jpg`,
    alt: "Neue Innenverkleidung eines Nutzfahrzeugs in mattem Schwarz",
    width: 1024,
    height: 1024,
  },
  {
    id: 24,
    slug: "autositz-reparatur",
    image: `${customer}/autositz-reparatur.jpg`,
    alt: "Reparierter Autositzbezug nach Sattlerarbeit in der Werkstatt",
    width: 1024,
    height: 1019,
  },
  {
    id: 25,
    slug: "schaltknauf-lederrestaurierung",
    image: `${customer}/schaltknauf-lederrestaurierung.jpg`,
    alt: "Schaltknauf und Schaltsack mit neuem Lederbezug",
    width: 1024,
    height: 1024,
  },
  {
    id: 4,
    slug: "projekt-04",
    image: "/images/projects/4.jpg",
    alt: "Neu bezogenes Ecksofa aus dunkelgrauem Samt in der Werkstatt",
    width: 1500,
    height: 1500,
  },
  {
    id: 10,
    slug: "projekt-10",
    image: "/images/projects/10.jpg",
    alt: "Maßgefertigte Gastronomie-Sitzbank in Schwarz mit Steppung",
    width: 1500,
    height: 1500,
  },
  {
    id: 11,
    slug: "projekt-11",
    image: "/images/projects/11.jpg",
    alt: "Neu bezogener roter Ohrensessel aus der Werkstatt",
    width: 1500,
    height: 1500,
  },
  {
    id: 12,
    slug: "projekt-12",
    image: "/images/projects/12.jpg",
    alt: "Gesteppte Gastronomie-Sitzbank in einem Restaurant",
    width: 1500,
    height: 1500,
  },
  {
    id: 8,
    slug: "projekt-08",
    image: "/images/projects/8.jpg",
    alt: "Vorher-Nachher: restaurierte Lederwange eines Autositzes",
    width: 1500,
    height: 1500,
  },
  {
    id: 5,
    slug: "projekt-05",
    image: "/images/projects/5.jpg",
    alt: "Vorher-Nachher: neu bezogener Autositz mit Leder und Streifenstoff",
    width: 1500,
    height: 1500,
  },
  {
    id: 7,
    slug: "projekt-07",
    image: "/images/projects/7.jpg",
    alt: "Ohrensessel mit neuem Veloursbezug neben der offenen Polsterung",
    width: 1500,
    height: 1500,
  },
  {
    id: 2,
    slug: "projekt-02",
    image: "/images/projects/2.jpg",
    alt: "Vorher-Nachher: erneuerter Fahrzeughimmel nach Sattlerarbeit",
    width: 1500,
    height: 1500,
  },
  {
    id: 3,
    slug: "projekt-03",
    image: "/images/projects/3.jpg",
    alt: "Vorher-Nachher: restaurierte Mittelarmlehne und Sitzwange im Fahrzeug",
    width: 1500,
    height: 1500,
  },
  {
    id: 1,
    slug: "projekt-01",
    image: "/images/projects/1.jpg",
    alt: "Vorher-Nachher: restaurierte Oldtimer-Sitzbank in Rot-Creme",
    width: 1500,
    height: 1500,
  },
  {
    id: 6,
    slug: "projekt-06",
    image: "/images/projects/6.jpg",
    alt: "Vorher-Nachher: neu gepolsterte Fahrzeugsitze in zweifarbigem Bezug",
    width: 1500,
    height: 1500,
  },
  {
    id: 9,
    slug: "projekt-09",
    image: "/images/projects/9.jpg",
    alt: "Vorher-Nachher: drei restaurierte Holzstühle mit floralem Damastbezug",
    width: 1500,
    height: 1500,
  },
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

export function projectAltText(project: Project | number) {
  if (typeof project === "number") {
    const match = projects.find((item) => item.id === project);
    return match?.alt ?? `Projekt ${project} — Polsterarbeit von GH Polsterei`;
  }
  return project.alt;
}
