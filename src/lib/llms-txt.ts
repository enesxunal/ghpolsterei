import { services } from "@/data/services";
import { site } from "@/data/site";

function absoluteUrl(path: string): string {
  if (path === "/") return site.website;
  return `${site.website}${path}`;
}

export function buildLlmsTxt(): string {
  const servicePages = services
    .map((service) => `- ${absoluteUrl(`/leistungen/${service.slug}`)} — ${service.title}`)
    .join("\n");

  const serviceNames = [
    "Möbel neu beziehen",
    "Aufpolstern",
    "Cabrioverdecke",
    "Autositze / Sattlerei",
    "Markisen / Planen",
    "Gastronomie-Sitzbänke",
  ];

  return `# GH Polsterei

> GH Polsterei is an upholstery and saddlery workshop based in Wesseling, North Rhine-Westphalia, Germany.

## Business facts

- Company: ${site.name}
- Owner: ${site.owner}
- Address: ${site.address.street}, ${site.address.postalCode} ${site.address.city}, ${site.address.country}
- Phone: ${site.phone}
- Email: ${site.email}
- Opening hours: Monday–Friday 09:00–17:00; Saturday by arrangement
- Service area: Wesseling (workshop), Rheinland / Nordrhein-Westfalen. Typical customer origins include Köln, Bonn, Brühl, Hürth, Bornheim, Frechen, Erftstadt, Pulheim, Rhein-Erft-Kreis and Rhein-Sieg-Kreis. There are no additional branches or offices.

## Important pages

- ${absoluteUrl("/")}
- ${absoluteUrl("/leistungen")}
${servicePages}
- ${absoluteUrl("/projekte")}
- ${absoluteUrl("/ueber-uns")}
- ${absoluteUrl("/einsatzgebiet")}
- ${absoluteUrl("/polsterei-koeln")}
- ${absoluteUrl("/polsterei-bonn")}
- ${absoluteUrl("/polsterei-rhein-erft-kreis")}
- ${absoluteUrl("/gh-polsterei")}
- ${absoluteUrl("/kontakt")}

## Services

${serviceNames.map((name) => `- ${name}`).join("\n")}
`;
}
