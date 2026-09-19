"use client";

// ---------------------------------------------------------------------------
// Telling a click from a throw.
//
// With gravity on, anything on the page can be grabbed and flung, and the
// release still lands on the thing the hand was carrying — which the browser
// reports as a click on it. The apple would switch gravity off at the end of
// every throw of the apple, and a cover would leave for its live site mid-game.
//
// So measure the press. Anything that travels further than a slip of the hand
// is a drag and does nothing; a press that stays put is a click, gravity or
// not. Keyboard activation arrives with no pointerdown before it and so is
// never a drag.
// ---------------------------------------------------------------------------

import { useRef } from "react";

/**
 * A click that was meant for the browser rather than the page: held with
 * cmd or ctrl for a new tab, shift for a new window, alt to download. A link
 * that does something of its own on a plain click — the cover and the name on
 * the list open a study in place — leaves these alone, so the address behind
 * it opens the way the reader asked for it to. The middle button and "open in
 * new tab" never arrive as a click at all and need nothing.
 */
export function modified(e: React.MouseEvent): boolean {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

// How far a press may travel and still count as a click, in px. Below a hand's
// natural slip; above it the pointer was going somewhere.
const SLOP = 5;

export function usePress(): {
  onPointerDown: (e: React.PointerEvent) => void;
  dragged: (e: React.MouseEvent) => boolean;
} {
  const from = useRef<{ x: number; y: number } | null>(null);

  return {
    onPointerDown: (e) => {
      from.current = { x: e.clientX, y: e.clientY };
    },
    dragged: (e) => {
      const start = from.current;
      from.current = null;
      if (!start) return false;
      return Math.hypot(e.clientX - start.x, e.clientY - start.y) > SLOP;
    },
  };
}
