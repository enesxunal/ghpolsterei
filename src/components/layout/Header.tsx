"use client";

import Link from "next/link";
import { useCallback, useEffect, useSyncExternalStore, useState } from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";
import { getMailtoHref, getTelHref } from "@/lib/links";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="static z-50 bg-navy lg:sticky lg:top-0">
      <Container as="nav" aria-label="Hauptnavigation">
        <div className="flex h-20 items-center justify-between gap-4 lg:h-[6.25rem]">
          <Link
            href="/"
            className="relative flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            onClick={closeMenu}
          >
            <BrandLogo
              variant="gold"
              priority
              className="h-[60px] w-auto max-w-none lg:h-[80px]"
            />
          </Link>

          <ul className="hidden flex-1 items-center justify-center gap-x-5 lg:flex xl:gap-x-8">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-[0.9375rem] font-medium tracking-wide text-ivory/90 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none"
                >
                  {item.label === "Home" ? site.name : item.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={getTelHref()}
            className="hidden shrink-0 items-center justify-center rounded-sm bg-gold px-4 py-2.5 text-[0.9375rem] font-medium tracking-wide text-navy transition-colors hover:bg-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:inline-flex"
          >
            Anrufen
          </a>

          <button
            type="button"
            className="relative z-[60] inline-flex h-11 w-11 shrink-0 items-center justify-center text-ivory lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Schließen" : "Menü"}</span>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function MobileMenu({ open, onClose }: MobileMenuProps) {
  const isClient = useIsClient();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!isClient || !open) {
    return null;
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 top-20 z-[90] bg-navy-deep/70 lg:hidden"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        id="mobile-menu"
        className="fixed inset-x-0 top-20 bottom-0 z-[95] flex flex-col bg-navy lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobilnavigation"
      >
        <Container className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain py-6">
          <ul className="flex flex-col">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b border-ivory/15 py-4 text-lg font-medium text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  onClick={onClose}
                >
                  {item.label === "Home" ? site.name : item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 border-t border-ivory/15 pt-6">
            <a
              href={getTelHref()}
              className="inline-flex items-center justify-center rounded-sm bg-gold px-5 py-3 text-base font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {site.phoneFormatted}
            </a>
            <a
              href={getMailtoHref()}
              className="block break-all text-base text-ivory/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {site.email}
            </a>
            <p className="text-sm leading-relaxed text-ivory/60">{site.openingHours}</p>
          </div>
        </Container>
      </div>
    </>,
    document.body,
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
