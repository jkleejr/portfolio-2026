// ---------------------------------------------------------------------------
// One line of the homepage, written out a character at a time on load.
//
// Everything the front page says goes through here. The case studies do not —
// they are pages someone has chosen to read, and text that arrives at 24ms a
// character is a thing to watch rather than a thing to read.
//
// Two copies of the line are rendered, stacked:
//
//   - The real one, in flow, at zero opacity. It reserves the exact height and
//     width the finished line will take, so nothing on the page moves while
//     the letters arrive — a blurb growing from one line to two would shove
//     the cover beside it, and every row below. It is also the copy that is in
//     the markup: a screen reader reads it, a crawler indexes it, and with
//     scripting off the <noscript> rule in layout.tsx brings it back to full
//     opacity, so the page still says what it says.
//   - The typed one, absolutely over it and hidden from assistive tech, so the
//     line is not announced twice.
//
// Selection follows the eye: the sizing copy is select-none, so a drag across
// the line takes the visible text rather than both copies.
// ---------------------------------------------------------------------------

"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { TextType } from "./text-type";

// Read as a subscription rather than in an effect: the value belongs to the
// browser, not to React, and setting state from an effect on mount is the
// cascading render this project's lint rejects. The server has no media query
// to read, so it assumes motion is wanted and the client corrects it on the
// first render after hydration.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function motionWantedOnServer() {
  return false;
}

// Fast enough that the page has finished writing itself before it reads as a
// wait. Lines set their own where the default does not suit their length — a
// short one is over before it registers at this pace.
const TYPING_SPEED = 24;

export function TypedLine({
  text,
  delay = 0,
  speed = TYPING_SPEED,
}: {
  // How long after the line scrolls into view it starts typing. The lines of a
  // block are staggered rather than run end to end: a strict queue would make
  // the last row of the page wait on every word above it.
  delay?: number;
  // Milliseconds a character. The default reads well for a sentence; a line of
  // a few words needs longer per character to last long enough to watch.
  speed?: number;
  text: string;
}) {
  const [done, setDone] = useState(false);
  // Decoration. Someone who has asked for less motion gets the line whole.
  const animate = !useSyncExternalStore(
    subscribeToMotionPreference,
    prefersReducedMotion,
    motionWantedOnServer,
  );

  // Stable, or TextType's typing effect would tear down and re-schedule its
  // next character every time anything above this re-renders.
  const handleComplete = useCallback(() => setDone(true), []);

  // inline-block, on the baseline, because a project title is followed by an
  // App Store or site mark on the same line and those hang off the baseline
  // the title sets. Shrink-to-fit inside a paragraph wraps at the same words
  // the raw text did.
  return (
    <span className="relative inline-block max-w-full whitespace-pre-wrap">
      <span
        data-typed-fallback
        className={animate ? "select-none opacity-0" : undefined}
      >
        {text}
      </span>
      {animate && (
        <span aria-hidden className="absolute inset-0">
          <TextType
            as="span"
            text={text}
            typingSpeed={speed}
            initialDelay={delay}
            loop={false}
            // The rows further down the page are written as they are reached
            // rather than off-screen while the top is still being read.
            startOnVisible
            // The caret belongs to the line being written. Left on, the
            // finished page would carry one at the end of every line.
            showCursor={!done}
            cursorCharacter="|"
            onComplete={handleComplete}
          />
        </span>
      )}
    </span>
  );
}
