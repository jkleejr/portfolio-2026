"use client";

// ---------------------------------------------------------------------------
// The cover on the homepage.
//
// One picture per project, and the way into what has been written about it:
// pressing one opens that project's case study under its row — see
// project-study.tsx, which holds the switch this reads. Off the list, where
// there is no switch to read, it falls back to the study's own page. An entry
// with a `srcHref` goes to the live site instead — seeing the real thing is
// not something a page about it can stand in for — and a project with nothing
// written about it yet is just the picture.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/data/case-studies";
import type { EntryImage } from "@/data/projects";
import { modified, usePress } from "./press";
import { useCoverToggle } from "./project-study";

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
        // Not while the page has weight. The cover is tumbling around the
        // screen by then, so a glance toward the cursor means nothing on it —
        // and the measurement below is a layout read on every pointer move,
        // taken against a page whose every word is being rewritten each frame.
        // That is the one place it is expensive, and it is the one place it
        // buys nothing.
        if (document.documentElement.classList.contains("gravity-on")) return;
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

  // The film under the pointer, for a cover that has one.
  const film = useRef<HTMLVideoElement>(null);
  const [rolling, setRolling] = useState(false);
  const enter = () => {
    const el = film.current;
    if (!el) return;
    // The promise rejects if the pointer leaves before it starts, which is
    // not a failure and not worth hearing about.
    void el.play().then(
      () => setRolling(true),
      () => {},
    );
  };
  const leave = () => {
    setRolling(false);
    const el = film.current;
    if (!el) return;
    el.pause();
    // Back to the frame the still is, so the next hover starts where the
    // picture left off rather than mid-shower.
    el.currentTime = 0;
  };

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
    // out of its own frame and leave the dot painted on it behind.
    //
    // The film, where there is one, is started and stopped from here rather
    // than left to autoplay: a loop running behind a pointer that is nowhere
    // near it is work nobody asked for, and five of them would be five.
    <motion.div
      data-gravity="piece"
      className={`${box} relative overflow-hidden`}
      style={tilt.style}
      onMouseEnter={image.coverVideo ? enter : undefined}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={() => {
        tilt.onMouseLeave();
        if (image.coverVideo) leave();
      }}
    >
      <Image
        src={shown}
        alt={image.alt}
        fill
        sizes="(width < 40rem) 104px, 200px"
        quality={90}
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
      {/* Over the still rather than instead of it. Until the first frame is
          decoded a video paints nothing, so what shows through is the cover —
          no hole where the picture was on the first hover, and no second
          picture to load for anyone who never hovers. It is only faded in
          once it is running, so a slow first start shows the still and not a
          black square. */}
      {image.coverVideo && (
        <video
          ref={film}
          src={image.coverVideo}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ease-out ${
            rolling ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {image.coverDot && <CoverDot dot={image.coverDot} />}
    </motion.div>
  ) : (
    // A project whose cover has not been taken yet still holds its row.
    <div className={`${box} bg-foreground/[0.02]`} aria-label={image.alt} />
  );

  // The lift under the pointer. On the list the whole row is the switch and
  // the cover answers a hover anywhere in it (row-hover, from ProjectRow);
  // a cover that leaves the page answers only its own.
  const lift =
    "block cursor-pointer rounded-lg transition-transform duration-200 ease-out";
  const ownLift = `${lift} hover:scale-105`;
  const rowLift = `${lift} hover:scale-105 row-hover:scale-105`;

  // A throw of the cover is not a click on it — see press.ts.
  const { onPointerDown, dragged } = usePress();

  // Set on the list, where a press opens the study in place. Null anywhere
  // else, and for a project with nothing written about it.
  const toggle = useCoverToggle();

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit ${label ?? image.alt}`}
        className={ownLift}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) e.preventDefault();
        }}
      >
        {inner}
      </a>
    );
  }

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
