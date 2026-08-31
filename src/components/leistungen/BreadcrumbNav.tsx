import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  tone?: "default" | "on-navy";
};

export function BreadcrumbNav({ items, tone = "default" }: BreadcrumbNavProps) {
  const onNavy = tone === "on-navy";

  return (
    <nav aria-label="Brotkrumen" className="mb-8">
      <ol
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${
          onNavy ? "text-ivory/70" : "text-muted"
        }`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
              {index > 0 && (
                <span aria-hidden="true" className={onNavy ? "text-ivory/30" : "text-border"}>
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={onNavy ? "text-ivory" : "text-navy"}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none ${
                    onNavy ? "hover:text-gold" : "hover:text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

