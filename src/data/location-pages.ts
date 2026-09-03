export type LocationPageContent = {
  slug: string;
  title: string;
  eyebrow: string;
  heading: string;
  intro: string;
  metadata: {
    title: string;
    description: string;
  };
  heroImage: {
    src: string;
    alt: string;
  };
  sections: {
    id: string;
    heading: string;
    paragraphs: string[];
  }[];
  relatedLinks: { href: string; label: string }[];
  cta: {
    heading: string;
    body: string;
  };
};

export const locationPages: LocationPageContent[] = [
  {
    slug: "polsterei-koeln",
    title: "Polsterei Köln",
    eyebrow: "Köln · Werkstatt in Wesseling",
    heading: "Polsterei für Köln — Ausführung in Wesseling",
    intro:
      "Für Polster- und Sattlerarbeiten aus Köln ist die Werkstatt der GH Polsterei in Wesseling die Adresse. Wir haben keine Filiale in Köln. Abholung und Lieferung sind nach Absprache möglich.",
    metadata: {
      title: "Polsterei für Köln | GH Polsterei Wesseling",
      description:
        "Polsterei für Köln: Möbel neu beziehen, Autositze und Gastronomie-Sitzbänke in Wesseling. Keine Kölner Filiale; Abholung nach Absprache.",
    },
    heroImage: {
      src: "/images/projects/10.jpg",
      alt: "Maßgefertigte Gastronomie-Sitzbank in Schwarz mit Steppung",
    },
    sections: [
      {
        id: "werkstatt",
        heading: "Die Werkstatt liegt in Wesseling, nicht in Köln",
        paragraphs: [
          "GH Polsterei ist ein Handwerksbetrieb in Wesseling. Die Werkstatt steht in der Industriestraße 45, 50389 Wesseling — südlich der Kölner Stadtgrenze, im Rhein-Erft-Kreis. Wer in Köln nach einer Polsterei sucht, findet uns dort, nicht in Ehrenfeld, der Innenstadt oder Porz.",
          "Das ist Absicht und kein Mangel. Polster- und Sattlerarbeiten brauchen Werkstatt, Maschinen und Zeit am Stück. Eine zweite Adresse in Köln betreiben wir nicht. Kundinnen und Kunden aus Köln kommen in die Werkstatt oder vereinbaren, dass wir das Stück nach Absprache abholen.",
          "Die Fahrzeit von Köln nach Wesseling ist kurz. Für viele Aufträge aus der Stadt ist das der praktische Weg: Termin absprechen, Möbel oder Sitze übergeben, Fertigstellung in der Werkstatt, Rückgabe nach Vereinbarung.",
          "Wer Cabrioverdecke erneuern lassen will und in Köln wohnt, folgt demselben Muster. Das Verdeck ist Sattlerarbeit in der Werkstatt, nicht eine Reparatur auf der Straße. Fotos und Fahrzeugtyp helfen bei der ersten Einschätzung, bevor ein Termin feststeht.",
        ],
      },
      {
        id: "sofa",
        heading: "Sofa und Sessel neu beziehen lassen",
        paragraphs: [
          "Eine häufige Frage aus Köln lautet: Wo kann ich mein Sofa neu beziehen lassen? Bei uns heißt die Antwort: in der Werkstatt in Wesseling. Der alte Bezug kommt runter, die Polsterung wird geprüft, der neue Stoff oder das Leder wird passgenau angebracht.",
          "Dasselbe gilt für Sessel, die durchgesessen sind. Wer alte Sessel aufpolstern lassen möchte, schickt uns Fotos oder kommt vorbei. Aufpolstern und Neubezug können zusammengehören; manchmal reicht die Polsterung, manchmal trägt nur ein neuer Bezug. Das klären wir am Stück, nicht pauschal.",
          "Wohnungen in Köln sind oft enger als eine Werkstattzufahrt. Deshalb ist Abholung nach Absprache für größere Sofas sinnvoll. Es ist kein Standardpaket. Größe, Etage und Termin müssen stimmen.",
        ],
      },
      {
        id: "gastronomie",
        heading: "Gastronomie in der Stadt, Fertigung in der Werkstatt",
        paragraphs: [
          "Köln hat viele Cafés, Restaurants und Bars. Sitzbänke dort halten hohe Frequenz aus — bis der Bezug glänzt, reißt oder Flecken nicht mehr weichen. Wir bauen Gastronomie-Sitzbänke neu oder restaurieren bestehende Anlagen.",
          "Die Fertigung bleibt in Wesseling. Vor Ort in der Gastronomie nehmen wir Maße auf oder arbeiten mit Ihren Plänen und Fotos. Polsterung, Bezug und Kanten entstehen in der Werkstatt. Lieferung und Montage nach Absprache.",
          "Wer in Köln einen Betrieb führt und Sitzmöbel erneuern will, muss uns nicht als Kölner Ladenlokal erwarten. Erwartbar ist Handwerk aus der Werkstatt und ein klarer Terminrahmen.",
        ],
      },
      {
        id: "fahrzeuge",
        heading: "Autositze und Cabrios aus Köln",
        paragraphs: [
          "Autositze neu beziehen oder restaurieren wir in der Sattlerei. Sitze können ausgebaut angeliefert werden; je nach Auftrag kommt das Fahrzeug in die Werkstatt. Cabrioverdecke erneuern wir ebenfalls hier — nicht mobil auf dem Parkplatz in der Stadt.",
          "Anfragen aus Köln zu Fahrzeugen behandeln wir wie Möbelaufträge: Zustand sehen, Material festlegen, in Wesseling arbeiten. Einen Hol- und Bringservice für Fahrzeuge gibt es nach Absprache, nicht als feste Tour durch alle Veedel.",
        ],
      },
      {
        id: "ablauf",
        heading: "So läuft ein Auftrag aus Köln",
        paragraphs: [
          "Sie schildern das Vorhaben per Telefon, E-Mail oder Formular. Fotos helfen bei der ersten Einschätzung. Anschließend vereinbaren wir, ob Sie nach Wesseling kommen oder ob Abholung infrage kommt.",
          "Montag bis Freitag sind wir von 09:00 bis 17:00 Uhr in der Werkstatt. Samstag nach Absprache. Die Übergabe nach Fertigstellung folgt demselben Muster.",
          "Ausführliche Hinweise zum Einzugsgebiet — auch über Köln hinaus — finden Sie auf der Seite zum Einsatzgebiet. Die Betriebsangaben stehen im Überblick zur GH Polsterei.",
          "Telefonisch, per E-Mail oder über das Formular: eine kurze Beschreibung des Stücks reicht für den Einstieg. Wir sagen, ob ein Termin in Wesseling oder eine Abholung der nächste Schritt ist.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/leistungen/neu-bezug-von-polstermoebeln", label: "Polstermöbel neu beziehen" },
      { href: "/leistungen/neubau-restaurierung-gastronomie-sitzbaenke", label: "Gastronomie-Sitzbänke" },
      { href: "/einsatzgebiet", label: "Einsatzgebiet" },
      { href: "/gh-polsterei", label: "Betrieb im Überblick" },
    ],
    cta: {
      heading: "Auftrag aus Köln anfragen",
      body: "Schreiben Sie uns aus Köln — die Werkstatt antwortet aus Wesseling.",
    },
  },
  {
    slug: "polsterei-bonn",
    title: "Polsterei Bonn",
    eyebrow: "Bonn · Werkstatt in Wesseling",
    heading: "Polsterei für Bonn — Möbel und Fahrzeuge",
    intro:
      "Kundinnen und Kunden aus Bonn und dem Rhein-Sieg-Kreis erreichen die GH Polsterei in Wesseling. Die Werkstatt steht dort, nicht in Bonn. Polster- und Sattlerarbeiten entstehen in der Industriestraße; Abholung ist nach Absprache möglich.",
    metadata: {
      title: "Polsterei für Bonn | Möbel & Fahrzeugsattlerei",
      description:
        "Polsterei für Bonn: Sessel, Sofas und Autositze in der Werkstatt in Wesseling. Keine Bonner Filiale, Abholung und Lieferung nach Absprache.",
    },
    heroImage: {
      src: "/images/projects/customer-2026/ohrensessel-lederrestaurierung.jpg",
      alt: "Ohrensessel mit neuem Lederbezug aus der Polsterei",
    },
    sections: [
      {
        id: "lage",
        heading: "Von Bonn nach Wesseling zur Werkstatt",
        paragraphs: [
          "GH Polsterei hat ihren Sitz in Wesseling, nicht in Bonn. Die Adresse lautet Industriestraße 45, 50389 Wesseling. Wer aus Bonn, Bad Godesberg, Beuel oder dem Rhein-Sieg-Kreis kommt, fährt zur Werkstatt oder vereinbart Abholung.",
          "Wir treten nicht als Bonner Polsterei mit Ladenadresse auf. Der Betrieb ist ein Handwerksbetrieb in Wesseling. Die Nähe zur Bonn/Köln-Region macht den Weg kurz; sie ersetzt keine zweite Werkstatt.",
          "Inhaber Abdalrazak Ghoul berät persönlich. Termine in der Werkstatt liegen montags bis freitags zwischen 09:00 und 17:00 Uhr. Samstag nach Absprache.",
        ],
      },
      {
        id: "moebel",
        heading: "Sessel aufpolstern und Möbel neu beziehen",
        paragraphs: [
          "Wer polstert alte Sessel auf? In unserem Fall die Werkstatt in Wesseling. Durchgesessene Sitze, nachgiebige Lehnen und Bezüge, die noch halten oder gerade nicht mehr, beurteilen wir am Stück. Aufpolstern bringt Volumen zurück; ein Neubezug ändert Stoff und Erscheinung.",
          "Aus Bonn erreichen uns oft einzelne Erbstücke und Sitzgruppen, die bleiben sollen. Die Unterkonstruktion entscheidet mit. Ein Sessel mit tragendem Gestell lohnt die Arbeit häufiger als ein Möbel, das nur noch Bezug ist.",
          "Sofas folgen demselben Weg. Neu beziehen lassen Sie das Stück in der Werkstatt. Für die Anfahrt aus Bonn oder für eine Abholung nach Absprache klären wir Maße und Zugang. Treppenhäuser und enge Wege gehören ins Gespräch, bevor jemand ein Sofa allein bewegt.",
        ],
      },
      {
        id: "fahrzeuge",
        heading: "Sattlerei: Sitze und Verdecke",
        paragraphs: [
          "Wo kann ich Autositze neu beziehen lassen, wenn ich in Bonn wohne? Bei uns in der Sattlerei in Wesseling. Lederrisse, abgeriebene Wangen und verschlissene Stoffsitze bearbeiten wir nach Demontage oder am Fahrzeug, je nach Umfang.",
          "Cabrioverdecke erneuern wir für Fahrzeuge aus NRW — darunter regelmäßig aus dem Raum Bonn. Das Verdeck ist Sattlerarbeit: Stoff, Spannung, Nähte, Einbau. Dafür braucht es die Werkstatt. Eine mobile Verdeckmontage als Standardangebot führen wir nicht.",
          "Markisen und Planen fertigen oder restaurieren wir ebenfalls in Wesseling. Für Häuser und Fahrzeuge aus Bonn gilt: Aufmaß klären, Zuschnitt in der Werkstatt, Montage oder Übergabe nach Vereinbarung.",
        ],
      },
      {
        id: "service",
        heading: "Abholung aus Bonn nach Absprache",
        paragraphs: [
          "Ein Abhol- und Lieferservice ist möglich, wenn Auftrag und Weg zusammenpassen. Aus Bonn ist die Distanz überschaubar; trotzdem bleibt es eine Absprache, kein automatischer Abholtag.",
          "Viele Kunden aus Bonn und Bornheim bringen Sitze, Stühle oder kleinere Möbel selbst. Größere Stücke und Fahrzeuge planen wir. Was nicht geht, sagen wir früh — etwa wenn Termine, Größe oder Zugang nicht tragfähig sind.",
          "Gastronomie-Sitzbänke aus Bonn und dem Rhein-Sieg-Kreis fertigen oder restaurieren wir ebenfalls in Wesseling. Der Betrieb bleibt vor Ort; die Bank entsteht in der Werkstatt. Lieferung nach Absprache.",
        ],
      },
      {
        id: "naechste",
        heading: "Weiterlesen und anfragen",
        paragraphs: [
          "Leistungen im Überblick stehen unter Polster- und Sattlerarbeiten. Das regionale Bild — Wesseling als Sitz, NRW als Einzugsgebiet — beschreibt die Seite Einsatzgebiet. Für Köln und den Rhein-Erft-Kreis gibt es eigene Hinweise; Bonn bleibt an die Werkstatt in Wesseling gebunden.",
          "Anfragen richten Sie telefonisch, per E-Mail oder über das Kontaktformular. Wir antworten aus der Werkstatt, nicht aus einem Büro in Bonn.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/leistungen/aufpolstern", label: "Möbel aufpolstern" },
      { href: "/leistungen/sattlerei-autositze", label: "Autositze neu beziehen" },
      { href: "/einsatzgebiet", label: "Einsatzgebiet" },
      { href: "/projekte", label: "Projekte" },
    ],
    cta: {
      heading: "Anfrage aus Bonn",
      body: "Möbel oder Fahrzeug schildern — wir melden uns aus Wesseling.",
    },
  },
  {
    slug: "polsterei-rhein-erft-kreis",
    title: "Rhein-Erft-Kreis",
    eyebrow: "Rhein-Erft-Kreis · Sitz in Wesseling",
    heading: "Polsterei im Rhein-Erft-Kreis",
    intro:
      "Wesseling gehört zum Rhein-Erft-Kreis. Die Werkstatt der GH Polsterei steht hier — in der Industriestraße 45. Nachbarorte wie Brühl, Hürth, Frechen, Erftstadt und Pulheim liegen nah. Eine zweite Betriebsstätte im Kreis gibt es nicht.",
    metadata: {
      title: "Polsterei im Rhein-Erft-Kreis | GH Polsterei",
      description:
        "Polsterei im Rhein-Erft-Kreis: Werkstatt in Wesseling für Möbel, Autositze und Cabrioverdecke. Abholung in der Nachbarschaft nach Absprache.",
    },
    heroImage: {
      src: "/images/projects/customer-2026/cabrio-verdeck-werkstatt-01.jpg",
      alt: "Sattlerarbeit an einem schwarzen Cabrio-Verdeck in der Werkstatt",
    },
    sections: [
      {
        id: "sitz",
        heading: "Werkstatt im Kreis, nicht nur „in der Nähe“",
        paragraphs: [
          "GH Polsterei ist im Rhein-Erft-Kreis zu Hause. Die einzige Geschäftsadresse ist Industriestraße 45, 50389 Wesseling. Wer in Brühl, Hürth, Frechen, Erftstadt oder Pulheim wohnt, hat zur Werkstatt einen kurzen Weg — ohne dass wir in jedem Ort ein Ladenlokal unterhalten.",
          "Das unterscheidet diese Seite von den Hinweisen zu Köln oder Bonn. Dort ist Wesseling die Werkstatt außerhalb der Stadt. Hier ist Wesseling der Standort im Kreis selbst. Polster- und Sattlerarbeiten entstehen an diesem Sitz.",
          "Inhaber ist Abdalrazak Ghoul. Handwerkskammer zu Köln, Handwerksrolle, USt-IdNr. stehen im Impressum. Für die tägliche Arbeit zählen Werkstattzeiten: Montag bis Freitag 09:00 bis 17:00 Uhr, Samstag nach Absprache.",
        ],
      },
      {
        id: "nachbarn",
        heading: "Nachbarorte und der Weg zur Werkstatt",
        paragraphs: [
          "Aus Brühl, Hürth oder Frechen ist eine Anlieferung in die Industriestraße oft der einfachste Weg. Stühle, Einzelsessel und Autositze passen in viele Fahrzeuge. Sofas und Sitzbänke brauchen Planung.",
          "Erftstadt und Pulheim liegen etwas weiter, bleiben aber im Kreis. Abholung nach Absprache ist gerade hier häufig sinnvoll — nicht weil wir einen Filialbetrieb hätten, sondern weil ein Möbelstück nicht in jeden PKW passt.",
          "Wir sitzen in Wesseling und betreuen Kunden aus diesen Orten in derselben Werkstatt. Es gibt keine „GH Polsterei Brühl“ und keine Werkstatt Hürth. Wer uns beauftragt, beauftragt Wesseling.",
        ],
      },
      {
        id: "leistungen-kreis",
        heading: "Was in der Werkstatt gemacht wird",
        paragraphs: [
          "Zum Alltag gehören Polstermöbel neu beziehen, aufpolstern, Gastronomie-Sitzbänke, Autositze, Cabrioverdecke sowie Markisen und Planen. Welche Arbeit passt, hängt vom Stück ab — nicht vom Ortsnamen.",
          "Wer Cabrioverdecke in NRW erneuern lassen will und im Rhein-Erft-Kreis wohnt, hat den Sitz der Sattlerei vor Ort. Das Verdeck kommt in die Werkstatt. Dasselbe gilt für Autositze: Neubezug und Restaurierung finden hier statt.",
          "Gastronomie im Kreis — vom Café in Brühl bis zum Betrieb in Hürth — kann Sitzbänke bei uns fertigen oder restaurieren lassen. Maße und Fotos zuerst; Fertigung in Wesseling; Lieferung nach Absprache.",
        ],
      },
      {
        id: "abholung-kreis",
        heading: "Kurze Wege, trotzdem Absprache",
        paragraphs: [
          "Weil viele Kunden im selben Kreis wohnen, wirkt Abholung selbstverständlich. Sie bleibt dennoch nach Absprache. Wir fahren nicht täglich eine feste Runde durch alle Kommunen.",
          "Was wir zusagen, hängt von Auftrag, Kalender und Transport ab. Kleine Stücke geben viele selbst in der Werkstatt ab. Das ist oft schneller als eine Abholung, die extra terminiert werden muss.",
          "Gibt es einen Abhol- und Lieferservice? Ja, nach Absprache. Im Rhein-Erft-Kreis ist der Radius klein. Verbindlich wird er erst, wenn Weg und Stück geklärt sind.",
        ],
      },
      {
        id: "darueber-hinaus",
        heading: "Kreis, Rheinland, NRW",
        paragraphs: [
          "Der Rhein-Erft-Kreis ist das unmittelbare Umfeld. Darüber hinaus betreuen wir Kunden aus Köln, Bonn und weiteren Teilen Nordrhein-Westfalens. Die Werkstattadresse ändert sich dadurch nicht.",
          "Wenn Sie unsicher sind, ob Ihr Ort zum Einzugsgebiet gehört: fragen Sie. Wir sagen, ob Anlieferung oder Abholung sinnvoll ist. Weitere Regionen und typische Herkunftsorte stehen auf der Seite Einsatzgebiet.",
          "Eine Anfrage aus dem Kreis braucht keine Umwege über Köln. Sie erreichen uns direkt: Telefon, E-Mail oder Formular. Die Werkstatt antwortet aus Wesseling.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/leistungen/cabrio-neu-beziehen", label: "Cabrioverdecke" },
      { href: "/leistungen/markisen", label: "Markisen & Planen" },
      { href: "/einsatzgebiet", label: "Einsatzgebiet" },
      { href: "/gh-polsterei", label: "GH Polsterei" },
    ],
    cta: {
      heading: "Anfrage aus dem Rhein-Erft-Kreis",
      body: "Kurzer Weg zur Werkstatt in Wesseling — schreiben oder anrufen genügt.",
    },
  },
];

export function getLocationPage(slug: string): LocationPageContent | undefined {
  return locationPages.find((page) => page.slug === slug);
}
