export type ServiceSection = {
  heading: string;
  paragraphs: string[];
  listItems?: string[];
};

export type ServiceProcessStep = {
  title: string;
  description: string;
};

export type ServiceLayoutVariant =
  | "split-right"
  | "split-left"
  | "stacked"
  | "offset"
  | "wide-image"
  | "narrow-image";

export type ServiceWorkshopImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Service = {
  id: number;
  slug: string;
  title: string;
  name: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  intro: string;
  sections: ServiceSection[];
  process: {
    heading: string;
    steps: ServiceProcessStep[];
  };
  relatedServices: string[];
  layoutVariant: ServiceLayoutVariant;
  workshopImages?: ServiceWorkshopImage[];
  legacyText: string;
};

export const leistungenPage = {
  title: "Leistungen",
  heading: "Leistungen der GH Polsterei",
  intro:
    "In unserer Werkstatt in Wesseling fertigen und restaurieren wir Polstermöbel, Sattlerarbeiten und textile Lösungen für Innenräume, Gastronomie und Fahrzeuge. Hier finden Sie alle Leistungen im Überblick — mit Einblick in Ablauf, Einsatzbereiche und passende Referenzen.",
  metadata: {
    title: "Leistungen — Polsterei & Sattlerei in Wesseling",
    description:
      "Polstermöbel neu beziehen, Aufpolstern, Gastronomie-Sitzbänke, Markisen, Cabrio-Verdecke und Autositze: alle Leistungen der GH Polsterei in Wesseling im Überblick.",
  },
} as const;

export const services: Service[] = [
  {
    id: 1,
    slug: "neu-bezug-von-polstermoebeln",
    title: "Polstermöbel neu beziehen",
    name: "Polstermöbel neu beziehen",
    description: "Neubezug für zeitlose Eleganz",
    seoTitle: "Polstermöbel neu beziehen in Wesseling",
    metaDescription:
      "Polstermöbel professionell neu beziehen in Wesseling: Stoff- und Lederbezüge, passgenaue Verarbeitung und sorgfältige Restaurierung bei GH Polsterei.",
    image:
      "/images/services/sewing-car-seat-cover-2022-09-26-21-05-47-utc-scaled.jpg",
    imageAlt: "Polsterarbeit an einem Möbelstück in der Werkstatt",
    eyebrow: "Polsterei",
    intro:
      "Ein neuer Bezug verändert ein Möbelstück grundlegend — ohne den Charakter des Stücks zu verlieren. In unserer Werkstatt in Wesseling beziehen wir Sessel, Sofas, Hocker und Sitzmöbel mit passenden Stoffen oder Leder neu. Dabei achten wir auf saubere Kanten, gleichmäßige Spannung und eine Verarbeitung, die dem Möbel angemessen ist.",
    sections: [
      {
        heading: "Was ein Neubezug leistet",
        paragraphs: [
          "Über die Jahre verlieren Polster ihre Form, der Bezug wird dünn oder fleckig. Ein fachgerechter Neubezug bringt Sitzkomfort und Optik zurück — oft mit deutlich längerer Nutzungsdauer als ein Ersatz aus dem Möbelhaus.",
          "Wir arbeiten mit Ihnen Stoffqualität, Farbe und Haptik ab. Ob dezentes Uni, robustes Möbelvelours oder Leder: Die Wahl des Materials bestimmt maßgeblich, wie das Stück später wirkt und wie es im Alltag besteht.",
        ],
      },
      {
        heading: "Für welche Möbel und Situationen",
        paragraphs: [
          "Typisch sind Einzelsessel, Zweisitzer, Esszimmerstühle mit Polstersitz sowie Sitzbänke im Wohnbereich. Auch ältere Möbel mit stabiler Unterkonstruktion lohnen sich häufig — ein neuer Bezug ist oft die nachhaltigere Alternative zum Wegwerfen.",
        ],
        listItems: [
          "Abgenutzte oder fleckige Bezüge an Sesseln und Sofas",
          "Stoffwechsel nach Umzug oder Einrichtungsneugestaltung",
          "Ergänzung einzelner Stühle zu einer bestehenden Sitzgruppe",
          "Auffrischung von Erbstücken mit erhaltenswerter Konstruktion",
        ],
      },
      {
        heading: "Handwerk aus der Werkstatt",
        paragraphs: [
          "Jedes Möbelstück wird einzeln betrachtet: Polsterung prüfen, Bezug abnehmen, Unterpolsterung bei Bedarf erneuern und den neuen Bezug präzise anbringen. So entsteht ein Ergebnis, das zum Möbel passt — nicht nur zum Katalog.",
          "Gerne beraten wir Sie vor Ort in der Werkstatt oder anhand von Fotos, welcher Umfang sinnvoll ist und welche Materialien sich für Ihren Alltag eignen.",
        ],
      },
    ],
    process: {
      heading: "So läuft Ihr Neubezug ab",
      steps: [
        {
          title: "Erstgespräch",
          description:
            "Sie schildern Möbelstück, Zustand und Wunschstoff. Wir klären Umfang und Terminrahmen.",
        },
        {
          title: "Material & Muster",
          description:
            "Gemeinsam wählen wir Bezugsstoff oder Leder. Auf Wunsch bringen Sie Stoffmuster mit.",
        },
        {
          title: "Ausführung in der Werkstatt",
          description:
            "Abnahme des alten Bezugs, Prüfung der Polsterung, Neubezug mit handwerklicher Sorgfalt.",
        },
        {
          title: "Übergabe",
          description:
            "Übergabe nach Vereinbarung — Abhol-/Lieferservice nach Absprache.",
        },
      ],
    },
    relatedServices: ["aufpolstern", "neubau-restaurierung-gastronomie-sitzbaenke"],
    layoutVariant: "split-right",
    legacyText:
      "Neu Bezug von Polstermöbeln — Neubezug für zeitlose Eleganz. Experte für hochwertige und maßgeschneiderte Innenausstattung.",
  },
  {
    id: 2,
    slug: "cabrio-neu-beziehen",
    title: "Cabrioverdecke neu beziehen",
    name: "Cabrioverdecke neu beziehen",
    description: "Maßgeschneiderte Cabrio-Verdecke",
    seoTitle: "Cabrio-Verdeck neu beziehen — Sattlerei Wesseling",
    metaDescription:
      "Cabrio-Verdecke fachgerecht neu beziehen und restaurieren in Wesseling. Maßanfertigung und Sattlerarbeit für offene Fahrzeuge bei GH Polsterei.",
    image: "/images/services/polster-2.png",
    imageAlt: "Cabrio-Verdeck — Sattlerarbeit in der Werkstatt",
    eyebrow: "Sattlerei",
    intro:
      "Ein Cabrio-Verdeck ist mehr als Stoff über dem Fahrzeug — es schützt vor Witterung, muss sauber schließen und zum Fahrzeugtyp passen. In Wesseling fertigen und beziehen wir Cabrio-Verdecke als Sattlerarbeit: passgenau, mit geeigneten Materialien und der Sorgfalt, die textile Fahrzeugausstattung erfordert.",
    sections: [
      {
        heading: "Verdecke, die zum Fahrzeug passen",
        paragraphs: [
          "Risse, ausgeblichene Stoffe oder undichte Nähte machen ein Verdeck unbrauchbar. Ein Neubezug oder eine Neuaufbereitung stellt Funktion und Erscheinungsbild wieder her — vorausgesetzt, die Mechanik und Rahmen sind intakt.",
          "Wir orientieren uns am Fahrzeugmodell und am gewünschten Ergebnis: Farbe, Stoffqualität und Verarbeitung werden vor der Ausführung besprochen.",
        ],
      },
      {
        heading: "Typische Anlässe",
        paragraphs: [
          "Klassische Cabrios und Roadster mit textilen Verdecken profitieren besonders von einer fachgerechten Sattlerarbeit. Auch ältere Fahrzeuge, bei denen Originalbezüge nicht mehr erhältlich sind, können oft individuell versorgt werden.",
        ],
        listItems: [
          "Rissige oder undichte Cabrio-Verdecke",
          "Verfärbter oder poröser Stoff",
          "Wunsch nach neuer Farbgebung",
          "Restaurierung älterer Fahrzeuge mit textilem Verdeck",
        ],
      },
      {
        heading: "Sattlerarbeit mit Blick fürs Detail",
        paragraphs: [
          "Verdecke unterliegen Sonne, Regen und mechanischer Belastung beim Öffnen und Schließen. Deshalb zählen saubere Nähte, tragfähige Materialien und eine Verarbeitung, die den Spannungsverlauf des Verdeckträgers berücksichtigt.",
          "Sprechen Sie uns an, wenn Sie den Zustand Ihres Verdeckes einschätzen lassen oder einen Neubezug planen möchten. Fotos und Fahrzeugtyp helfen bei der ersten Einschätzung.",
        ],
      },
    ],
    process: {
      heading: "Ablauf beim Cabrio-Neubezug",
      steps: [
        {
          title: "Zustand prüfen",
          description:
            "Verdeck und Mechanik begutachten — wir klären, ob Neubezug oder umfangreichere Arbeiten nötig sind.",
        },
        {
          title: "Material festlegen",
          description:
            "Stoffqualität und Farbe abstimmen, passend zum Fahrzeug und zur Nutzung.",
        },
        {
          title: "Demontage & Neubezug",
          description:
            "Fachgerechte Abnahme und Neuanfertigung des Bezugs in unserer Sattlerei.",
        },
        {
          title: "Montage & Kontrolle",
          description:
            "Einbau, Schlusskontrolle auf Spannung und Dichtigkeit — Übergabe nach Termin.",
        },
      ],
    },
    relatedServices: ["sattlerei-autositze", "markisen"],
    layoutVariant: "split-left",
    workshopImages: [
      {
        src: "/images/projects/customer-2026/cabrio-verdeck-werkstatt-01.jpg",
        alt: "Sattlerarbeit an einem schwarzen Cabrio-Verdeck in der Werkstatt",
        width: 1024,
        height: 743,
      },
      {
        src: "/images/projects/customer-2026/cabrio-verdeck-werkstatt-02.jpg",
        alt: "Prüfung eines Cabrio-Verdecks in der GH Polsterei Werkstatt",
        width: 1024,
        height: 760,
      },
      {
        src: "/images/projects/customer-2026/cabrio-verdeck-werkstatt-03.jpg",
        alt: "Arbeit am Verdeck eines roten Cabrios in der Werkstatt",
        width: 766,
        height: 995,
      },
      {
        src: "/images/projects/customer-2026/cabrio-verdeck-werkstatt-04.jpg",
        alt: "Einbau der Heckscheibe an einem Cabrio-Verdeck",
        width: 767,
        height: 995,
      },
    ],
    legacyText:
      "Cabrio neu beziehen — Maßgeschneiderte Cabrio-Verdecke. Sattlerarbeiten für Autositze und Cabrios.",
  },
  {
    id: 3,
    slug: "aufpolstern",
    title: "Möbel aufpolstern",
    name: "Möbel aufpolstern",
    description: "Professionelles Aufpolstern für neuen Komfort",
    seoTitle: "Möbel aufpolstern in Wesseling",
    metaDescription:
      "Möbel und Sitzpolster professionell aufpolstern in Wesseling. Mehr Komfort und Form für Sessel, Sofas und Sitzmöbel — GH Polsterei.",
    image: "/images/services/aufpolstern.png",
    imageAlt: "Aufpolstern eines Sitzmöbels in der Polsterei",
    eyebrow: "Polsterei",
    intro:
      "Wenn der Bezug noch in Ordnung ist, die Polsterung aber nachgibt, hilft gezieltes Aufpolstern. Wir erneuern oder ergänzen Unterpolsterung und Füllmaterial, damit Sitzflächen und Lehnen wieder angenehm stützen — ohne das Möbel komplett neu beziehen zu müssen.",
    sections: [
      {
        heading: "Komfort durch erneuerte Polsterung",
        paragraphs: [
          "Eingesunkene Sitze, durchgesessene Polster oder harte Kanten entstehen, wenn Füllmaterial seine Elastizität verliert. Aufpolstern bringt Volumen und Stützkraft zurück und kann die Lebensdauer eines Möbelstücks deutlich verlängern.",
          "Je nach Zustand arbeiten wir die Polsterung partiell oder vollständig auf — immer abgestimmt auf Konstruktion und späteren Bezug.",
        ],
      },
      {
        heading: "Wann Aufpolstern sinnvoll ist",
        paragraphs: [
          "Aufpolstern eignet sich besonders, wenn der Bezug noch tragfähig ist oder zeitnah erneuert werden soll. Es ist auch eine sinnvolle Vorbereitung vor einem Neubezug, wenn die Unterpolsterung nicht mehr ausreicht.",
        ],
        listItems: [
          "Durchgesessene Sofas und Sessel",
          "Harte oder unebene Sitzflächen",
          "Vorbereitung für einen anschließenden Neubezug",
          "Ergänzung abgenutzter Armlehnen- oder Rückenpolster",
        ],
      },
      {
        heading: "Handwerkliche Ausführung",
        paragraphs: [
          "Wir prüfen Federung, Unterpolsterung und Bezug. Wo nötig, ersetzen wir Füllmaterial und formen die Polsterung wieder stimmig. Das Ergebnis soll sich im Alltag bemerkbar machen — beim Sitzen, nicht nur auf Fotos.",
          "In einem Gespräch klären wir, ob Aufpolstern allein ausreicht oder ob ein Neubezug die bessere Lösung ist.",
        ],
      },
    ],
    process: {
      heading: "Ablauf beim Aufpolstern",
      steps: [
        {
          title: "Begutachtung",
          description:
            "Möbelstück ansehen — wir beurteilen Polsterzustand und sinnvollen Umfang.",
        },
        {
          title: "Angebot & Termin",
          description:
            "Umfang und Material abstimmen, Werkstatttermin vereinbaren.",
        },
        {
          title: "Aufarbeitung",
          description:
            "Bezug öffnen, Polsterung erneuern oder ergänzen, Form wiederherstellen.",
        },
        {
          title: "Fertigstellung",
          description:
            "Bezug schließen oder Vorbereitung für Neubezug — Abhol-/Lieferservice nach Absprache.",
        },
      ],
    },
    relatedServices: ["neu-bezug-von-polstermoebeln", "neubau-restaurierung-gastronomie-sitzbaenke"],
    layoutVariant: "stacked",
    legacyText:
      "Aufpolstern — Professionelles Aufpolstern für neuen Komfort.",
  },
  {
    id: 4,
    slug: "markisen",
    title: "Markisen & Planen",
    name: "Markisen & Planen",
    description: "Markisen-Restaurierung; Planen für LKW/Anhänger",
    seoTitle: "Markisen & Planen — Restaurierung in Wesseling",
    metaDescription:
      "Markisen restaurieren und Planen für LKW und Anhänger in Wesseling. Textile Lösungen und Sattlerarbeit von GH Polsterei.",
    image: "/images/services/3.png",
    imageAlt: "Markisen- und Planenarbeit in der Werkstatt",
    eyebrow: "Textile Lösungen",
    intro:
      "Markisen schützen Terrassen und Schaufenster — Planen sichern Ladung auf LKW und Anhängern. Wenn Stoffe porös werden oder Nähte reißen, übernehmen wir Restaurierung und Neuanfertigung textile Lösungen in unserer Werkstatt in Wesseling.",
    sections: [
      {
        heading: "Markisen und Planen im Überblick",
        paragraphs: [
          "Sonnenschutz und wetterfeste Abdeckungen unterliegen ständiger Beanspruchung. UV-Strahlung, Feuchtigkeit und Wind setzen Material und Nähten zu. Eine fachgerechte Instandsetzung verlängert die Nutzungsdauer und erhält die Funktion.",
          "Neben klassischen Markisen arbeiten wir auch an Planen für Nutzfahrzeuge — maßgeschneidert und mit Blick auf Belastung im Einsatz.",
        ],
      },
      {
        heading: "Typische Aufträge",
        paragraphs: [
          "Ob geländefähige Markise am Haus, Gelenkarmmarkise oder Plane auf dem Aufbau — entscheidend sind passendes Material, saubere Verarbeitung und ein Zuschnitt, der zur Konstruktion passt.",
        ],
        listItems: [
          "Rissige oder ausgeblichene Markisenstoffe",
          "Undichte oder gerissene Nähte an Planen",
          "Neuanfertigung von Abdeckplanen für LKW und Anhänger",
          "Austausch verschlissener Markisenbahnen",
        ],
      },
      {
        heading: "Restaurierung statt Wegwerfen",
        paragraphs: [
          "Wo die Mechanik noch intakt ist, lohnt sich oft der Austausch oder die Reparatur des Stoffes. Wir beraten, ob eine Reparatur ausreicht oder ein neuer Stoff die bessere Wahl ist.",
          "Bringen Sie Fotos oder Maße mit — so können wir den Aufwand früh einschätzen und Materialoptionen besprechen.",
        ],
      },
    ],
    process: {
      heading: "Ablauf bei Markisen & Planen",
      steps: [
        {
          title: "Aufmaß & Zustand",
          description:
            "Maße, Befestigung und Materialzustand erfassen — vor Ort oder anhand Ihrer Angaben.",
        },
        {
          title: "Materialwahl",
          description:
            "Stoff oder Plane passend zu Einsatz und Beanspruchung auswählen.",
        },
        {
          title: "Anfertigung",
          description:
            "Zuschnitt, Nähen und Verarbeitung in der Werkstatt.",
        },
        {
          title: "Montage",
          description:
            "Einbau oder Übergabe zur Montage — je nach Umfang des Auftrags.",
        },
      ],
    },
    relatedServices: ["cabrio-neu-beziehen", "sattlerei-autositze"],
    layoutVariant: "offset",
    legacyText:
      "Markisen — Markisen-Restaurierung; Planen für LKW/Anhänger. Markisen / PVC Plane auf der Startseite.",
  },
  {
    id: 5,
    slug: "neubau-restaurierung-gastronomie-sitzbaenke",
    title: "Gastronomie-Sitzbänke: Neubau & Restaurierung",
    name: "Gastronomie-Sitzbänke: Neubau & Restaurierung",
    description: "Maßgeschneiderte Sitzbänke für Gastronomie",
    seoTitle: "Gastronomie-Sitzbänke — Neubau & Restaurierung Wesseling",
    metaDescription:
      "Gastronomie-Sitzbänke maßgeschneidert neu bauen oder restaurieren in Wesseling. Robuste Polsterlösungen für Restaurants und Cafés — GH Polsterei.",
    image: "/images/services/polster-1.png",
    imageAlt: "Gastronomie-Sitzbank — Polsterarbeit für den Gastronomiebereich",
    eyebrow: "Gastronomie",
    intro:
      "In Restaurants, Cafés und Bars zählen Sitzbänke täglich: hohe Frequenz, Flecken, Abrieb. Wir bauen Gastronomie-Sitzbänke neu oder restaurieren bestehende Anlagen — mit robusten Materialien, sauberer Verarbeitung und Maßen, die zum Raum passen.",
    sections: [
      {
        heading: "Sitzlösungen für den Gastronomiebetrieb",
        paragraphs: [
          "Gastronomie-Sitzbänke verbinden Komfort für Gäste mit Belastbarkeit im Betrieb. Ob lange Sitzbank an der Wand, Ecklösung oder einzelne Module — wir fertigen nach Maß und berücksichtigen Reinigung, Stoffwahl und den Umgang im laufenden Betrieb.",
          "Bei Restaurierungen prüfen wir Unterkonstruktion und Polsterung. Oft lohnt sich die Erneuerung von Bezug und Polster, ohne die gesamte Bank zu ersetzen.",
        ],
      },
      {
        heading: "Typische Projekte",
        paragraphs: [
          "Neueröffnungen, Umbauten oder die Auffrischung abgenutzter Bestuhlung — wir passen Umfang und Material an den Einsatzort an.",
        ],
        listItems: [
          "Neubau von Sitzbänken für Restaurant oder Café",
          "Restaurierung abgenutzter Gastronomie-Polster",
          "Stoffwechsel bei laufendem oder pausiertem Betrieb",
          "Ergänzung einzelner Module zu bestehenden Reihen",
        ],
      },
      {
        heading: "Auf Langlebigkeit ausgelegt",
        paragraphs: [
          "Gastronomie verlangt strapazierfähige Bezüge und saubere Kanten. Wir beraten zu pflegeleichten Stoffen und einer Verarbeitung, die den Alltag im Betrieb mitträgt.",
          "Referenzbilder aus unserer Werkstatt finden Sie im Bereich Projekte — dort sehen Sie, wie vielfältig unsere Arbeit ausfallen kann.",
        ],
      },
    ],
    process: {
      heading: "Ablauf bei Gastronomie-Sitzbänken",
      steps: [
        {
          title: "Beratung vor Ort",
          description:
            "Raum, Maße und Nutzung besprechen — auf Wunsch mit Fotos oder Besuch in der Werkstatt.",
        },
        {
          title: "Planung & Material",
          description:
            "Konstruktion, Polsterung und Bezug festlegen — abgestimmt auf Gastronomieeinsatz.",
        },
        {
          title: "Fertigung",
          description:
            "Neubau oder Restaurierung in unserer Werkstatt in Wesseling.",
        },
        {
          title: "Lieferung & Montage",
          description:
            "Übergabe nach Vereinbarung — Abholung oder Lieferservice nach Absprache.",
        },
      ],
    },
    relatedServices: ["neu-bezug-von-polstermoebeln", "aufpolstern"],
    layoutVariant: "wide-image",
    legacyText:
      "Neubau/Restaurierung von Gastronomie Sitzbänken — Maßgeschneiderte Sitzbänke für Gastronomie.",
  },
  {
    id: 6,
    slug: "sattlerei-autositze",
    title: "Autositze neu beziehen & restaurieren",
    name: "Autositze neu beziehen & restaurieren",
    description: "Autositze beziehen/restaurieren",
    seoTitle: "Autositze neu beziehen — Sattlerei Wesseling",
    metaDescription:
      "Autositze fachgerecht neu beziehen und restaurieren in Wesseling. Sattlerarbeit für Fahrzeugsitze — Leder und Stoff bei GH Polsterei.",
    image: "/images/services/1.png",
    imageAlt: "Autositze — Sattlerarbeit und Neubezug in der Werkstatt",
    eyebrow: "Sattlerei",
    intro:
      "Autositze tragen täglich — und zeigen Gebrauchsspuren: Risse im Leder, aufgerissene Nähte, ausgeblichene Stoffe. In unserer Sattlerei in Wesseling beziehen und restaurieren wir Fahrzeugsitze, damit Innenraum und Komfort wieder stimmig wirken.",
    sections: [
      {
        heading: "Sattlerarbeit für Fahrzeugsitze",
        paragraphs: [
          "Ein Neubezug oder eine Teilrestaurierung kann ein Fahrzeug innen deutlich aufwerten — besonders bei älteren Modellen oder Fahrzeugen mit besonderem Wert. Wir arbeiten Sitzflächen, Lehnen und Armlehnen je nach Bedarf auf.",
          "Material und Farbe stimmen wir mit Ihnen ab: Leder, Kunstleder oder Stoff — passend zum Fahrzeug und zur Nutzung.",
        ],
      },
      {
        heading: "Wann ein Neubezug sinnvoll ist",
        paragraphs: [
          "Nicht jeder Riss erfordert einen Komplettbezug. In einem ersten Gespräch klären wir, ob Teilreparatur, Aufarbeitung oder voller Neubezug der richtige Weg ist.",
        ],
        listItems: [
          "Risse und Abnutzung an Sitzflächen und Lehnen",
          "Ausgeblichenes oder poröses Leder",
          "Beschädigte Nähte und Kanten an Autositzen",
          "Aufwertung älterer oder klassischer Fahrzeuge",
        ],
      },
      {
        heading: "Präzision in der Sattlerei",
        paragraphs: [
          "Fahrzeugsitze verlangen passgenaue Schnitte und saubere Verarbeitung — sichtbare Kanten, Kontrastnähte und Befestigungspunkte müssen stimmen. Wir nehmen uns die Zeit, die Sattlerarbeit verlangt.",
          "Fotos von den betroffenen Sitzen und die Fahrzeugangabe helfen bei der ersten Einschätzung. Gerne vereinbaren wir einen Termin in der Werkstatt.",
        ],
      },
    ],
    process: {
      heading: "Ablauf bei Autositzen",
      steps: [
        {
          title: "Zustand dokumentieren",
          description:
            "Sitze begutachten — Fotos und Fahrzeugtyp für die Planung.",
        },
        {
          title: "Umfang festlegen",
          description:
            "Teilrestaurierung oder Vollbezug, Material und Farbe wählen.",
        },
        {
          title: "Ausführung",
          description:
            "Demontage, Neubezug oder Reparatur in der Sattlerei.",
        },
        {
          title: "Einbau & Übergabe",
          description:
            "Sitze einbauen, Schlusskontrolle — Abholung nach Termin.",
        },
      ],
    },
    relatedServices: ["cabrio-neu-beziehen", "markisen"],
    layoutVariant: "narrow-image",
    legacyText:
      "Sattlerei Arbeiten wie Autositze neu beziehen/Restaurieren — Autositze beziehen/restaurieren.",
  },
];

export const serviceSlugs = services.map((service) => service.slug);

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(service: Service): Service[] {
  return service.relatedServices
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is Service => Boolean(item));
}

export const homepageServiceNames = [
  "Polstermöbel neu beziehen",
  "Möbel aufpolstern",
  "Gastronomie-Sitzbänke: Neubau & Restaurierung",
  "Markisen & Planen",
  "Autositze neu beziehen & restaurieren",
  "Cabrioverdecke neu beziehen",
] as const;

/** @deprecated Use leistungenPage */
export const servicesPage = {
  title: "Leistungsangebot",
} as const;
