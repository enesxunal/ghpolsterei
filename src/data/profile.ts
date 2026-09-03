import { site } from "@/data/site";

const addressLine = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

export const profilePage = {
  title: "GH Polsterei",
  eyebrow: "Betrieb",
  heading: "GH Polsterei – Polsterei & Sattlerei in Wesseling",
  intro:
    "GH Polsterei ist die Werkstatt von Abdalrazak Ghoul in Wesseling. Hier entstehen Polsterarbeiten an Möbeln und Sattlerarbeiten an Fahrzeugen. Es gibt eine Adresse, keine weiteren Filialen.",
  metadata: {
    title: "GH Polsterei | Polsterei & Sattlerei in Wesseling",
    description:
      "GH Polsterei in Wesseling: Inhaber, Adresse, Leistungen, Einzugsgebiet, Öffnungszeiten und Kontakt der Polsterei und Sattlerei.",
  },
  heroImage: {
    src: "/images/legacy/sewing-car-seat-cover.jpg",
    alt: "Sattlerarbeit in der Werkstatt — Bezug wird genäht",
  },
  facts: [
    { label: "Unternehmen", value: site.name },
    { label: "Inhaber", value: site.owner },
    { label: "Adresse", value: addressLine },
    { label: "Telefon", value: site.phoneFormatted },
    { label: "E-Mail", value: site.email },
    { label: "Öffnungszeiten", value: site.openingHours },
  ],
  sections: [
    {
      id: "wer",
      heading: "Wer wir sind",
      paragraphs: [
        "GH Polsterei ist ein Handwerksbetrieb für Polsterei und Sattlerei. Inhaber ist Abdalrazak Ghoul. Der Betrieb ist in der Handwerkskammer zu Köln eingetragen (Handwerksrolle Nr. 1234150). Die USt-IdNr. lautet DE364438920.",
        "Die Arbeit ist Werkstattarbeit: Bezüge, Polsterungen, textile Fahrzeugteile. Beratung und Ausführung laufen über denselben Betrieb. Es gibt kein getrenntes Verkaufsbüro und keine zweite Werkstattadresse.",
        "Leistungen im Einzelnen stehen auf den Leistungsseiten. Einen Blick auf fertige Stücke gibt die Projektübersicht. Diese Seite sammelt die betrieblichen Fakten an einem Ort.",
        "GH Polsterei ist kein Filialunternehmen. Es gibt keine zweite Werkstatt in Köln, Bonn oder einer anderen Kommune. Wer den Betrieb meint, meint Wesseling.",
      ],
    },
    {
      id: "wo",
      heading: "Wo sich die Werkstatt befindet",
      paragraphs: [
        `Die Werkstatt liegt in der ${site.address.street} in ${site.address.postalCode} ${site.address.city}, ${site.address.country}. Das ist die einzige physische Adresse von GH Polsterei.`,
        "Wesseling liegt im Rhein-Erft-Kreis, südlich von Köln, nördlich von Bonn am Rhein. Kundinnen und Kunden erreichen uns mit dem Auto; Anlieferung von Möbeln und Fahrzeugen nach Termin ist der übliche Weg.",
        "Wir geben keine weiteren Ortsadressen an. Hinweise zu Köln, Bonn oder anderen Kommunen meinen das Einzugsgebiet, nicht ein Ladenlokal vor Ort.",
      ],
    },
    {
      id: "leistungen",
      heading: "Welche Leistungen angeboten werden",
      paragraphs: [
        "Polsterei: Polstermöbel neu beziehen, Möbel aufpolstern, Gastronomie-Sitzbänke neu bauen oder restaurieren.",
        "Sattlerei und textile Arbeiten: Autositze neu beziehen und restaurieren, Cabrioverdecke erneuern, Markisen und Planen fertigen oder restaurieren.",
        "Jedes Stück wird einzeln betrachtet. Stoff, Leder und Umfang ergeben sich aus Zustand und Nutzung. Pauschalpakete ohne Blick auf das Möbel oder Fahrzeug gehören nicht zum Angebot.",
        "Wer ein Sofa neu beziehen, einen Sessel aufpolstern, Autositze erneuern oder ein Cabrioverdeck in NRW machen lassen will, fragt denselben Betrieb. Die Zuordnung zur passenden Leistung klären wir in der Anfrage.",
      ],
    },
    {
      id: "gebiet",
      heading: "Welches Gebiet betreut wird",
      paragraphs: [
        "Der Sitz ist Wesseling. Betreut werden Kunden aus dem Rheinland und aus weiteren Teilen von Nordrhein-Westfalen. Typisch sind Wesseling, Köln, Bonn, der Rhein-Erft-Kreis, der Rhein-Sieg-Kreis und benachbarte Kommunen wie Brühl, Hürth, Bornheim, Frechen, Erftstadt und Pulheim.",
        "Welche Regionen betreut GH Polsterei? Die Werkstatt in Wesseling und ein Einzugsgebiet in NRW — ohne Zweigstellen. Details zum Einzugsgebiet stehen auf einer eigenen Seite.",
        "Eine Anfrage aus einer dieser Regionen richtet sich immer an dieselbe Werkstatt. Es ändert sich die Anfahrt oder die Absprache zur Abholung, nicht die Adresse.",
      ],
    },
    {
      id: "service",
      heading: "Abhol- und Lieferservice",
      paragraphs: [
        "Gibt es einen Abhol- und Lieferservice? Nach Absprache ja. Es handelt sich nicht um einen festen Lieferschein mit täglichen Touren. Größe, Gewicht, Entfernung und Kalender entscheiden.",
        "Übergabe in der Werkstatt ist immer möglich zu den Öffnungszeiten bzw. zu einem vereinbarten Termin. Samstag nur nach Absprache.",
      ],
    },
    {
      id: "kontakt",
      heading: "Kontakt und Öffnungszeiten",
      paragraphs: [
        `Telefon: ${site.phoneFormatted}. E-Mail: ${site.email}. Website: ${site.website}.`,
        "Öffnungszeiten: Montag bis Freitag 09:00–17:00 Uhr. Samstag nach Absprache. Eine durchgehende Samstagsöffnung gibt es nicht.",
        "Anfragen können Sie auch über das Kontaktformular stellen. Für ein Angebot helfen kurze Angaben zum Stück und Fotos.",
        "Diese Seite ist der kurze Betriebsüberblick. Die Werkstattgeschichte und der Arbeitsweg stehen unter Über uns. Das regionale Einzugsgebiet ist gesondert beschrieben.",
        "Kontaktwege sind Telefon, E-Mail und das Formular auf der Kontaktseite. Für ein erstes Angebot genügen in der Regel Fotos und eine kurze Schilderung des Stücks.",
      ],
    },
  ],
  pageLinks: [
    { href: "/leistungen", label: "Leistungen" },
    { href: "/projekte", label: "Projekte" },
    { href: "/ueber-uns", label: "Über uns" },
    { href: "/einsatzgebiet", label: "Einsatzgebiet" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  cta: {
    heading: "Direkt anfragen",
    body: "Telefon, E-Mail oder Formular — die Werkstatt in Wesseling antwortet.",
  },
} as const;
