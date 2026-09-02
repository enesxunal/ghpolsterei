"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import type { Project } from "@/data/projects";

type ProjectsGalleryProps = {
  projects: Project[];
};

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = projects.map((project) => ({
    src: project.image,
    alt: project.alt,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      <ul className="columns-1 gap-2 sm:columns-2 sm:gap-3 lg:columns-3 lg:gap-3">
        {projects.map((project, index) => (
          <li key={project.id} className="mb-2 break-inside-avoid sm:mb-3">
            <button
              type="button"
              className="group relative block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={`${project.alt} vergrößern`}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={project.image}
                alt={project.alt}
                width={project.width}
                height={project.height}
                className="h-auto w-full transition-[filter] duration-500 group-hover:brightness-110 motion-reduce:transition-none"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="absolute inset-0 bg-dark/0 transition-colors duration-300 group-hover:bg-dark/15 motion-reduce:transition-none" />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={lightboxIndex !== null}
        images={images}
        index={lightboxIndex ?? 0}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
