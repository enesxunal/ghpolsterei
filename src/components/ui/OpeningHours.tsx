import { site } from "@/data/site";

type OpeningHoursProps = {
  className?: string;
};

export function OpeningHours({ className = "" }: OpeningHoursProps) {
  return (
    <span className={className}>
      {site.openingHoursLines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </span>
  );
}
