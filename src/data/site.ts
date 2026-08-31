export const site = {
  name: "GH Polsterei",
  tagline: "GH Polsterei | Sattlerei — A. Ghoul",
  owner: "Abdalrazak Ghoul",
  address: {
    street: "Industriestraße 45",
    postalCode: "50389",
    city: "Wesseling",
    country: "Deutschland",
  },
  phone: "0163 6924387",
  phoneFormatted: "0163 / 6924387",
  email: "gh.polsterei@gmail.com",
  website: "https://ghpolsterei.de",
  businessType: "Handwerksbetrieb",
  chamber: "Handwerkskammer zu Köln",
  tradeRegisterNo: "1234150",
  vatId: "DE364438920",
  openingHours: "Mo – Sa: 09:00 – 17:00 Uhr",
  googleMapsQuery: "GH Polsterei",
  copyright: "© 2026 GH Polsterei | Sattlerei",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Leistungen", href: "/leistungen" },
    { label: "Projekte", href: "/projekte" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  trustReasons: [
    "Hochwertiges Material",
    "Handwerksrolle Köln",
    "Sorgfältige Ausführung",
    "Zeitliche Verfügbarkeit",
    "Schnelle Antwort",
    "Lieferservice",
  ],
  servicesIntro:
    "Experte für hochwertige und maßgeschneiderte Innenausstattung; Möbel erneuern/restaurieren; gastronomische Sitzbänke; Sattlerarbeiten für Autositze und Cabrios.",
  brand: {
    logoColor: "/images/brand/gh-polsterei-gold-trimmed.png",
    logoWhite: "/images/brand/gh-polsterei-white-trimmed.png",
  },
  // Unverified legacy counters/promo from the old site — do not render until confirmed.
  legacy: {
    promo: "20% Rabatt für Neukunden",
    stats: {
      yearsInBusiness: "15+",
      satisfiedCustomers: "1.500+",
      completedOrders: "2.500+",
      trainedStaff: "150+",
    },
  },
} as const;

export type Site = typeof site;
