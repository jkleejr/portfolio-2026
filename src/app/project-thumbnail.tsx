"use client";

// ---------------------------------------------------------------------------
// The cover on the homepage.
//
// One picture per project, and the way into what has been written about it:
// pressing one opens that project's case study under its row — see
// project-study.tsx, which holds the switch this reads. Off the list, where
// there is no switch to read, it falls back to the study's own page. A
// project with nothing written about it yet is just the picture.
// ---------------------------------------------------------------------------

import { motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/data/case-studies";
import type { EntryImage } from "@/data/projects";
import { modified, usePress } from "./press";
import { useCoverToggle } from "./project-study";

// ---------------------------------------------------------------------------
// The tilt under the pointer. The cover turns about its middle as if the
// pointer were pressing on it: the edge nearest the cursor sinks away and the
// far one comes up, at most TILT degrees either way, and it springs back flat
// when the pointer leaves. Springs rather than a transition, so a quick pass
// over the square eases in and out instead of snapping to each new angle.
// ---------------------------------------------------------------------------

const TILT = 14;
const TILT_SPRING = { damping: 25, stiffness: 350, mass: 0.5 };

function useTilt() {
  const rotateX = useSpring(useMotionValue(0), TILT_SPRING);
  const rotateY = useSpring(useMotionValue(0), TILT_SPRING);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Not while the page has weight: the cover is being thrown about by then,
    // and gravity writes this same transform itself.
    if (document.documentElement.classList.contains("gravity-on")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = e.currentTarget.getBoundingClientRect();
    // -1 to 1 across the square, 0 at its middle.
    const x = (e.clientX - box.left) / (box.width / 2) - 1;
    const y = (e.clientY - box.top) / (box.height / 2) - 1;
    rotateX.set(-y * TILT);
    rotateY.set(x * TILT);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    style: { rotateX, rotateY, transformPerspective: 800 },
    onMouseMove,
    onMouseLeave,
  };
}

export function ProjectThumbnail({
  image,
  slug,
}: {
  image: EntryImage;
  slug: string;
}) {
  const study = caseStudies[slug];

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

  const tilt = useTilt();

  // The screenshots are ~1200px wide, so letting the browser squeeze one into a
  // box this size is a ~6x downscale that its cheap filter turns to mush.
  // next/image resamples them properly and ships a 2x variant for retina
  // screens instead. The hint has to be plain lengths, so this is the one place
  // --cover and the phone's smaller value are written out rather than read —
  // and have to be kept in step with it. Undersize the hint and the browser
  // asks for a variant smaller than the box, then stretches it, which is a
  // soft cover on every retina screen.
  const inner = shown ? (
    // Marked for gravity: with no button around it any more, the box is the
    // outermost thing here, and without the marker the image inside would fall
    // out of its own frame.
    <motion.div
      data-gravity="piece"
      className={`${box} relative overflow-hidden`}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <Image
        src={shown}
        alt={image.alt}
        fill
        sizes="(width < 40rem) 104px, 200px"
        quality={90}
        // Fetched with the page rather than when layout finds them near the
        // screen. The first two are above the fold on every phone, and left
        // lazy they sat as empty squares — no square at all, for a cover with
        // no hairline — for a second or two on a slow connection. There are
        // five, each a few kilobytes at this size, so the ones below the fold
        // cost nothing worth deferring.
        loading="eager"
        className="object-cover"
        style={
          image.cover
            ? {
                objectPosition: image.coverCrop,
                // Scaled about the middle of the square, so the framing
                // `coverCrop` set stays put and every edge draws in equally.
                transform: image.coverZoom
                  ? `scale(${image.coverZoom})`
                  : undefined,
              }
            : image.crop
              ? { objectPosition: image.crop }
              : undefined
        }
      />
    </motion.div>
  ) : (
    // A project whose cover has not been taken yet still holds its row.
    <div className={`${box} bg-foreground/[0.02]`} aria-label={image.alt} />
  );

  // The lift under the pointer. On the list the whole row is the switch and
  // the cover answers a hover anywhere in it (row-hover, from ProjectRow).
  const lift =
    "block cursor-pointer rounded-lg transition-transform duration-100 ease-out";
  const rowLift = `${lift} hover:scale-105 row-hover:scale-105`;

  // A throw of the cover is not a click on it — see press.ts.
  const { onPointerDown, dragged } = usePress();

  // Set on the list, where a press opens the study in place. Null anywhere
  // else, and for a project with nothing written about it.
  const toggle = useCoverToggle();

  // On the list the picture is a switch, not a way out of the page: a plain
  // click opens the study under the row and closes it again, and
  // aria-expanded is what says so to anything not looking at the screen. It
  // is a link to the open study's address all the same, for the clicks that
  // ask for another tab — see the note at the top of project-title.tsx, which
  // is the same switch and the same link.
  if (study && toggle) {
    return (
      <Link
        href={`/${slug}`}
        prefetch={false}
        draggable={false}
        aria-expanded={toggle.open}
        aria-label={`${toggle.open ? "Close" : "Read"} the ${study.title} case study`}
        className={rowLift}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) return e.preventDefault();
          if (modified(e)) return;
          e.preventDefault();
          toggle.toggle();
        }}
      >
        {inner}
      </Link>
    );
  }

  if (study) {
    return (
      <Link
        href={`/projects/${slug}`}
        aria-label={`Read the ${study.title} case study`}
        className={rowLift}
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
