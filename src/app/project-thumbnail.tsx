"use client";

// ---------------------------------------------------------------------------
// The cover on the homepage.
//
// One picture per project, on top of a stack of the study's shots — drag it
// aside and the next is under it, see stack.tsx — and the way into what has
// been written about it:
// pressing one opens that project's case study under its row — see
// project-study.tsx, which holds the switch this reads. Off the list, where
// there is no switch to read, it falls back to the study's own page. An entry
// with a `srcHref` goes to the live site instead — seeing the real thing is
// not something a page about it can stand in for — and a project with nothing
// written about it yet is just the picture.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { caseStudies, studyShots } from "@/data/case-studies";
import type { EntryImage } from "@/data/projects";
import { usePress } from "./press";
import { useCoverToggle } from "./project-study";
import { Stack, type StackCard } from "./stack";

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
  // Each card in the stack is its own rounded box; the frame around the whole
  // thing has no edge of its own any more, since the cards behind fan out
  // past it.
  const cardBox = "h-full w-full overflow-hidden rounded-lg";
  const shotBox = `${cardBox} border border-foreground/10`;

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

  // The screenshots are ~1200px wide, so letting the browser squeeze one into a
  // box this size is a ~6x downscale that its cheap filter turns to mush.
  // next/image resamples them properly and ships a 2x variant for retina
  // screens instead. The hint has to be plain lengths, so this is the one place
  // --cover and the phone's smaller value are written out rather than read —
  // and have to be kept in step with it. Undersize the hint and the browser
  // asks for a variant smaller than the box, then stretches it, which is a
  // soft cover on every retina screen.
  const sizes = "(width < 40rem) 104px, 200px";

  // The cover is the top of a stack, and the cards under it are the study's
  // shots — or whatever the entry says instead. Drag the cover aside and the
  // next one is there; see stack.tsx. The film and the dot ride on the cover's
  // card, so they go to the back with it.
  //
  // Three behind at most when they are taken from the study: each card back
  // is turned another four degrees and drawn a little smaller, and past four
  // the pile is a fan, wider than the row it is in.
  const behind =
    image.stack ??
    studyShots(slug)
      .filter((s) => s.src !== shown)
      .slice(0, 3);
  const cards: StackCard[] = shown
    ? [
        ...behind.map((shot) => ({
          id: shot.src,
          content: (
            <div className={`${shotBox} relative`}>
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes={sizes}
                quality={90}
                className="pointer-events-none select-none object-cover"
                style={shot.crop ? { objectPosition: shot.crop } : undefined}
              />
            </div>
          ),
        })),
        {
          id: shown,
          content: (
            <div className={`${image.cover ? cardBox : shotBox} relative`}>
              <Image
                src={shown}
                alt={image.alt}
                fill
                sizes={sizes}
                quality={90}
                className="pointer-events-none select-none object-cover"
                style={
                  image.cover
                    ? image.coverCrop
                      ? { objectPosition: image.coverCrop }
                      : undefined
                    : image.crop
                      ? { objectPosition: image.crop }
                      : undefined
                }
              />
              {/* Over the still rather than instead of it. Until the first
                  frame is decoded a video paints nothing, so what shows
                  through is the cover — no hole where the picture was on the
                  first hover, and no second picture to load for anyone who
                  never hovers. It is only faded in once it is running, so a
                  slow first start shows the still and not a black square. */}
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
            </div>
          ),
        },
      ]
    : [];

  const inner = shown ? (
    // Marked for gravity: with no button around it any more, the box is the
    // outermost thing here, and without the marker the cards inside would fall
    // out of their own frame and leave the dot painted on one behind.
    //
    // The film, where there is one, is started and stopped from here rather
    // than left to autoplay: a loop running behind a pointer that is nowhere
    // near it is work nobody asked for, and five of them would be five.
    <Stack
      data-gravity="piece"
      className={size}
      cards={cards}
      onMouseEnter={image.coverVideo ? enter : undefined}
      onMouseLeave={image.coverVideo ? leave : undefined}
    />
  ) : (
    // A project whose cover has not been taken yet still holds its row.
    <div
      className={`${size} rounded-lg border border-foreground/10 bg-foreground/[0.02]`}
      aria-label={image.alt}
    />
  );

  // The lift under the pointer. On the list the whole row is the switch and
  // the cover answers a hover anywhere in it (group-hover, from ProjectRow);
  // a cover that leaves the page answers only its own.
  const lift =
    "block cursor-pointer rounded-lg transition-transform duration-200 ease-out";
  const ownLift = `${lift} hover:scale-105`;
  const rowLift = `${lift} hover:scale-105 group-hover:scale-105`;

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

  // On the list the picture is a switch, not a way out of the page: it opens
  // the study under the row and closes it again. aria-expanded is what says so
  // to anything not looking at the screen, and it is why this is a button
  // rather than a link — nothing is being navigated to.
  if (study && toggle) {
    return (
      <button
        type="button"
        aria-expanded={toggle.open}
        aria-label={`${toggle.open ? "Close" : "Read"} the ${study.title} case study`}
        className={rowLift}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) return;
          toggle.toggle();
        }}
      >
        {inner}
      </button>
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
