"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Project } from "@/data/projects";
import { Lightbox } from "@/components/ui/Lightbox";

type HomeProjectsGalleryProps = {
  projects: Project[];
  previewCount: number;
};

export function HomeProjectsGallery({ projects, previewCount }: HomeProjectsGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const preview = projects.slice(0, showAll ? undefined : previewCount);
  const galleryImages = projects.map((project) => ({
    src: project.image,
    alt: project.alt,
  }));
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <>
      <ul id="startseite-projektgalerie" className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:gap-4">
        {preview.map((project, index) => (
          <li
            key={project.id}
            className={`min-w-0 overflow-hidden ${
              index === 0
                ? "col-span-2 row-span-2 aspect-[4/5] sm:aspect-[3/4]"
                : "aspect-square"
            }`}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`${project.alt} vergr\u00f6\u00dfern`}
              className="group relative block h-full w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Image
                src={project.image}
                alt={project.alt}
                fill
                loading="lazy"
                className="object-cover object-center transition-[transform,filter] duration-500 group-hover:brightness-110 motion-reduce:transition-none"
                sizes={
                  index === 0
                    ? "(max-width: 640px) 100vw, 50vw"
                    : "(max-width: 640px) 50vw, 25vw"
                }
              />
              <span className="absolute inset-0 bg-dark/0 transition-colors duration-300 group-hover:bg-dark/15 motion-reduce:transition-none" />
            </button>
          </li>
        ))}
      </ul>

      {projects.length > previewCount && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-controls="startseite-projektgalerie"
            aria-expanded={showAll}
            onClick={() => setShowAll((previous) => !previous)}
            className="inline-flex min-h-12 items-center justify-center border border-gold/60 px-7 py-3 text-sm font-medium tracking-wide text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
          >
            {showAll ? "Weniger Bilder anzeigen" : `Alle ${projects.length} Bilder anzeigen`}
          </button>
        </div>
      )}

      <Lightbox
        open={lightboxIndex !== null}
        images={galleryImages}
        index={lightboxIndex ?? 0}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
