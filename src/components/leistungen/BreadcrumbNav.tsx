import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  tone?: "default" | "on-dark";
};

export function BreadcrumbNav({ items, tone = "default" }: BreadcrumbNavProps) {
  const onDark = tone === "on-dark";

  return (
    <nav aria-label="Brotkrumen" className="mb-8">
      <ol
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${
          onDark ? "text-ivory/70" : "text-muted"
        }`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
              {index > 0 && (
                <span aria-hidden="true" className={onDark ? "text-ivory/30" : "text-border"}>
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={onDark ? "text-ivory" : "text-dark"}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none ${
                    onDark ? "hover:text-gold" : "hover:text-dark"
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

