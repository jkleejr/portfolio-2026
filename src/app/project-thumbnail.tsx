"use client";

// ---------------------------------------------------------------------------
// The cover on the homepage.
//
// One picture per project, and the way into what has been written about it:
// pressing one goes to that project's case study, at a page of its own. An
// entry with a `srcHref` goes to the live site instead — seeing the real thing
// is not something a page about it can stand in for — and a project with
// nothing written about it yet is just the picture.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/data/case-studies";
import type { EntryImage } from "@/data/projects";
import { usePress } from "./press";

// ---------------------------------------------------------------------------
// A dot painted over a cover that drifts toward the pointer, so the mark looks
// like it is watching the cursor. It leans in the pointer's direction and stops
// at `travel`, rather than tracking it one-to-one — the movement should read as
// a glance, not a drag.
// ---------------------------------------------------------------------------

function CoverDot({ dot }: { dot: NonNullable<EntryImage["coverDot"]> }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [lean, setLean] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Coalesce to one update a frame: mousemove fires far more often than the
    // screen refreshes, and each update costs a layout read.
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < 1) return setLean({ x: 0, y: 0 });
        setLean({ x: dx / distance, y: dy / distance });
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute rounded-full transition-transform duration-300 ease-out"
      style={{
        left: `${dot.x}%`,
        top: `${dot.y}%`,
        width: `${dot.size}%`,
        aspectRatio: "1",
        background: dot.color,
        // -50% centres it on (x, y); the lean rides on top of that. `travel`
        // is a share of the thumbnail, but a percentage translate is a share
        // of the element being moved, so it is rescaled against the dot's own
        // width here.
        transform: `translate(-50%, -50%) translate(${
          (lean.x * dot.travel * 100) / dot.size
        }%, ${(lean.y * dot.travel * 100) / dot.size}%)`,
      }}
    />
  );
}

export function ProjectThumbnail({
  image,
  slug,
  href,
}: {
  image: EntryImage;
  slug: string;
  href?: string;
}) {
  const study = caseStudies[slug];
  const label = image.title ?? study?.title;

  // A cover brings its own background, so the hairline that frames a
  // screenshot just reads as an outline around it — drop it for covers.
  // One size everywhere, now that the gallery is a single column: there is no
  // width to divide up, and a cover still leaves room beside it on the
  // narrowest phone. The size itself is --cover in globals.css, which the
  // writing beside it is placed off.
  const size = "h-[var(--cover)] w-[var(--cover)]";
  const box = image.cover
    ? `${size} rounded-lg`
    : `${size} rounded-lg border border-foreground/10`;

  // A cover stands in for the screenshot on the homepage only — image.src is
  // still the shot itself. `crop` frames that shot, so a cover ignores it.
  const shown = image.cover ?? image.src;

  // The screenshots are ~1200px wide, so letting the browser squeeze one into a
  // box this size is a ~6x downscale that its cheap filter turns to mush.
  // next/image resamples them properly and ships a 2x variant for retina
  // screens instead. The hint has to be a plain length, so it is the one place
  // --cover is written out rather than read.
  const inner = shown ? (
    // Marked for gravity: with no button around it any more, the box is the
    // outermost thing here, and without the marker the image inside would fall
    // out of its own frame and leave the dot painted on it behind.
    <div data-gravity="piece" className={`${box} relative overflow-hidden`}>
      <Image
        src={shown}
        alt={image.alt}
        fill
        sizes="168px"
        quality={90}
        className="object-cover"
        style={
          !image.cover && image.crop
            ? { objectPosition: image.crop }
            : undefined
        }
      />
      {image.coverDot && <CoverDot dot={image.coverDot} />}
    </div>
  ) : (
    // A project whose cover has not been taken yet still holds its row.
    <div className={`${box} bg-foreground/[0.02]`} aria-label={image.alt} />
  );

  const lift =
    "block cursor-pointer rounded-lg transition-transform duration-200 ease-out hover:scale-105";

  // A throw of the cover is not a click on it — see press.ts.
  const { onPointerDown, dragged } = usePress();

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit ${label ?? image.alt}`}
        className={lift}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) e.preventDefault();
        }}
      >
        {inner}
      </a>
    );
  }

  if (study) {
    return (
      <Link
        href={`/projects/${slug}`}
        aria-label={`Read the ${study.title} case study`}
        className={lift}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) e.preventDefault();
        }}
      >
        {inner}
      </Link>
    );
  }

  // A project with nothing written about it yet is a picture and nothing more.
  return inner;
}
