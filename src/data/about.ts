import { site } from "@/data/site";

export const aboutPage = {
  title: "Über uns",
  eyebrow: "Werkstatt · Wesseling",
  heading: "Handwerk mit Anspruch",
  lead: "Ihre Polsterei in Wesseling",
  intro:
    "GH Polsterei ist die Werkstatt von Abdalrazak Ghoul in Wesseling. Hier entstehen Polster- und Sattlerarbeiten für Möbel und Fahrzeuge — mit persönlicher Beratung und sauberer Ausführung.",
  metadata: {
    title: "Über GH Polsterei | Polsterei & Sattlerei Wesseling",
    description:
      "GH Polsterei in Wesseling: Werkstatt für Polster- und Sattlerarbeiten an Möbeln und Fahrzeugen. Persönliche Beratung durch Inhaber Abdalrazak Ghoul.",
  },
  workshop: {
    heading: "Die Werkstatt in Wesseling",
    paragraphs: [
      `Unsere Werkstatt liegt in der ${site.address.street} in ${site.address.postalCode} ${site.address.city}. Von hier aus betreuen wir Anfragen zu Polstermöbeln, Gastronomie-Sitzbänken und Sattlerarbeiten für Fahrzeuge.`,
      `Inhaber ist ${site.owner}. Beratung, Abstimmung und Ausführung laufen direkt über die Werkstatt — telefonisch, per E-Mail oder vor Ort nach Vereinbarung.`,
      "Mo – Fr: 09:00–17:00 Uhr, Sa: nach Absprache. Abhol-/Lieferservice nach Absprache.",
    ],
  },
  craft: {
    heading: "Polster- und Sattlerarbeiten",
    paragraphs: [
      "Im Möbelbereich beziehen und restaurieren wir Polstermöbel, arbeiten Polsterungen auf und fertigen oder erneuern Sitzbänke für die Gastronomie.",
      "Im Fahrzeugbereich gehören Autositze, Cabrio-Verdecke sowie Markisen und Planen zu den Sattlerarbeiten. Jeder Auftrag wird einzeln betrachtet: Zustand, Material und gewünschtes Ergebnis klären wir vor der Ausführung.",
    ],
  },
  consultation: {
    heading: "Persönliche Beratung",
    paragraphs: [
      "Eine Anfrage beginnt mit dem Gespräch: Möbelstück oder Fahrzeug, Nutzung und Wunschbild. Fotos helfen bei der ersten Einschätzung — ein Termin in der Werkstatt macht Material und Umfang greifbar.",
      "Wir beraten zu Stoff, Leder und Verarbeitung, ohne ein Standardpaket vorzugeben. Was sinnvoll ist, hängt vom Stück und vom Alltag ab.",
    ],
  },
  process: {
    heading: "Der Weg zum fertigen Stück",
    steps: [
      {
        number: "01",
        title: "Kontakt und Abstimmung",
        description:
          "Sie schildern Vorhaben und Zustand. Wir klären Umfang, Materialrichtung und einen realistischen Terminrahmen.",
      },
      {
        number: "02",
        title: "Arbeit in der Werkstatt",
        description:
          "Polster- und Sattlerarbeiten entstehen in Wesseling: Abnahme, Prüfung, Neubezug oder Aufarbeitung — passend zum jeweiligen Stück.",
      },
      {
        number: "03",
        title: "Übergabe",
        description:
          "Die Fertigstellung erfolgt nach Vereinbarung. Abhol-/Lieferservice nach Absprache.",
      },
    ],
  },
  materials: {
    heading: "Materialien",
    paragraphs: [
      "Für Bezüge kommen Stoffe und Leder infrage — je nach Möbel, Fahrzeug und Beanspruchung. Die Auswahl stimmen wir mit Ihnen ab: Optik, Haptik und Alltagstauglichkeit gehören zusammen.",
      "Welche Qualität zum Stück passt, ergibt sich im Gespräch und an Mustern. Wir versprechen keine Katalogware, sondern eine Verarbeitung, die zum Auftrag gehört.",
    ],
  },
  gallery: {
    heading: "Einblick in die Arbeit",
    intro:
      "Ausgewählte Aufnahmen aus der Werkstatt — Polster- und Sattlerarbeiten ohne Inszenierung.",
  },
  cta: {
    heading: "Projekt besprechen",
    body: "Sie möchten ein Möbel neu beziehen, Sitze aufarbeiten oder ein anderes Vorhaben klären? Schreiben Sie uns oder sehen Sie weitere Arbeiten aus der Werkstatt.",
  },
} as const;
