export const homepage = {
  hero: {
    eyebrow: "Handwerksbetrieb · Wesseling",
    title: "Polsterei & Sattlerei in Wesseling",
    supporting: "Handwerk mit Präzision und Stil.",
    subtitle:
      "GH Polsterei — Experte für hochwertige und maßgeschneiderte Innenausstattung: Polstermöbel, Gastronomie-Sitzbänke und Sattlerarbeiten für Autositze und Cabrios.",
    primaryImage: "/images/legacy/photo-texture-sofa-upholstery.jpg",
    secondaryImage: "/images/legacy/sewing-car-seat-cover.jpg",
  },
  trustBand: [
    "Polsterei in Wesseling",
    "Kostenlose Beratung",
    "Möbel & Fahrzeuge",
    "Saubere Handarbeit",
  ] as const,
  leistungen: {
    title: "Leistungen",
    heading: "Unser Leistungsangebot",
    intro:
      "Experte für hochwertige und maßgeschneiderte Innenausstattung; Möbel erneuern/restaurieren; gastronomische Sitzbänke; Sattlerarbeiten für Autositze und Cabrios.",
  },
  projects: {
    title: "Ausgewählte Arbeiten",
    heading: "Inspiration für Ihr nächstes Projekt",
    intro:
      "Ein Blick in unsere Werkstatt — von Polstermöbeln über Gastronomie-Sitzbänke bis zu Sattlerarbeiten.",
    count: 8,
  },
  craftsmanship: {
    title: "Handwerk",
    heading: "Meisterhafte Polsterarbeit",
    body:
      "In unserer Werkstatt in Wesseling verbinden wir sorgfältige Polster- und Sattlerarbeit mit persönlicher Beratung. Möbel und Fahrzeugsitze werden einzeln betrachtet und passend zum jeweiligen Projekt bearbeitet.",
    image: "/images/projects/4.jpg",
    detailImage: "/images/legacy/color-samples-upholstery-fabric.jpg",
  },
  process: {
    title: "Ablauf",
    heading: "In drei Schritten zu Ihrem Ergebnis",
    steps: [
      {
        number: "01",
        title: "Kontakt & Beratung",
        description:
          "Sie erreichen uns telefonisch oder per E-Mail — wir antworten schnell und beraten Sie zu Material, Umfang und Termin.",
      },
      {
        number: "02",
        title: "Handwerkliche Ausführung",
        description:
          "Polster- und Sattlerarbeiten entstehen in unserer Werkstatt in Wesseling — abgestimmt auf Möbelstück oder Fahrzeug.",
      },
      {
        number: "03",
        title: "Übergabe & Lieferservice",
        description:
          "Mo – Fr: 09:00 – 17:00 Uhr, Samstag nach Absprache. Abhol-/Lieferservice nach Absprache.",
      },
    ],
  },
  cta: {
    heading: "Bereit für Ihr nächstes Polsterprojekt?",
    body: "Rufen Sie uns an oder schreiben Sie uns — wir freuen uns auf Ihre Anfrage.",
  },
  metadata: {
    title: "GH Polsterei | Sattlerei — Polstermöbel & Sattlerarbeiten in Wesseling",
    description:
      "GH Polsterei in Wesseling: Polstermöbel neu beziehen, Aufpolstern, Gastronomie-Sitzbänke, Markisen, Cabrio-Verdecke und Autositze. Handwerksbetrieb — A. Ghoul.",
  },
  // Unverified legacy homepage claims — do not render until confirmed.
  legacy: {
    promo: "20% Rabatt für Neukunden",
  },
} as const;
