"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type LightboxProps = {
  open: boolean;
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({
  open,
  images,
  index,
  onClose,
  onNavigate,
}: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && hasMultiple) {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight" && hasMultiple) {
        event.preventDefault();
        goNext();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, goPrev, goNext, hasMultiple]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const current = images[index];
  if (!current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label={`Projektbild ${index + 1} von ${images.length}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy-deep/90 motion-reduce:transition-none"
        aria-label="Lightbox schließen"
        onClick={onClose}
      />

      <div className="pointer-events-none relative z-[1] flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="pointer-events-auto relative flex max-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col items-center">
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute -top-2 right-0 z-[2] inline-flex h-10 w-10 items-center justify-center rounded-sm text-ivory transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:-right-2 sm:-top-3 motion-reduce:transition-none"
            aria-label="Schließen"
            onClick={onClose}
          >
            <CloseIcon />
          </button>

          <figure className="relative flex max-h-[calc(100dvh-6rem)] w-full flex-col items-center">
            <div className="relative aspect-[4/3] max-h-[calc(100dvh-8rem)] w-full sm:aspect-[16/10]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
            <figcaption className="mt-4 max-w-prose text-center text-sm text-ivory/80">
              {current.alt}
              {hasMultiple ? (
                <span className="mt-1 block text-ivory/55">
                  {index + 1} / {images.length}
                </span>
              ) : null}
            </figcaption>
          </figure>

          {hasMultiple ? (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-[2] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm bg-navy/50 text-ivory backdrop-blur-sm transition-colors hover:bg-navy hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:left-4 motion-reduce:transition-none"
                aria-label="Vorheriges Bild"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrev();
                }}
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 z-[2] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm bg-navy/50 text-ivory backdrop-blur-sm transition-colors hover:bg-navy hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-4 motion-reduce:transition-none"
                aria-label="Nächstes Bild"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}
