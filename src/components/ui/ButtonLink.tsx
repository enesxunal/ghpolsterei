import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "gold" | "inverse" | "ghost";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-sm border px-6 py-3.5 text-[0.9375rem] font-medium tracking-wide transition-[color,background-color,border-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none";

/**
 * Color is owned by the variant. Do not pass text-/bg-/border- utilities via className —
 * Tailwind v4 does not guarantee source-order overrides, which made dark-section CTAs invisible.
 */
const variantClass: Record<ButtonVariant, string> = {
  primary: "border-dark bg-dark text-ivory hover:border-dark-deep hover:bg-dark-deep",
  secondary: "border-dark/45 bg-transparent text-dark hover:border-dark hover:bg-dark/[0.04]",
  gold: "border-gold bg-gold text-dark hover:border-gold-dark hover:bg-gold-dark",
  inverse:
    "border-ivory/55 bg-transparent text-ivory hover:border-gold hover:bg-ivory/[0.08] hover:text-gold",
  ghost: "border-transparent bg-transparent text-dark hover:text-gold",
};

export function buttonClassName(variant: ButtonVariant = "primary", className = "") {
  return [baseClass, variantClass[variant], className].filter(Boolean).join(" ");
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: ButtonLinkProps) {
  const classes = buttonClassName(variant, className);

  const isNativeLink =
    external || href.startsWith("tel:") || href.startsWith("mailto:");

  if (isNativeLink) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
