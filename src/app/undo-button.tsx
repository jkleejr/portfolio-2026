"use client";

// ---------------------------------------------------------------------------
// The way back from gravity.
//
// Once the apple has been pressed it falls with everything else, and finding
// it again on the floor to switch gravity off is part of the game but not the
// only way out. Two seconds after the press an undo arrow turns up where the
// apple stood, and pressing it switches gravity off — which puts every piece
// back where it came from and the apple back in its place — and goes away.
//
// It is not part of the game. It sits outside the corner stack and the page,
// which are the two things gravity takes apart, and it arrives after the
// simulation has already gathered its pieces, so nothing here ever falls. It
// is drawn above the pile, so a heap landing on the corner cannot bury it.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";

// How long gravity runs before the way back is offered, in ms.
const DELAY = 2000;

/**
 * Placed the way the corner stack is, and sized the way the apple is on the
 * About page, so its middle is the apple's middle — see SiteCorner.
 */
export function UndoButton({ on, undo }: { on: boolean; undo: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!on) return;
    const timer = setTimeout(() => setReady(true), DELAY);
    return () => {
      clearTimeout(timer);
      setReady(false);
    };
  }, [on]);

  if (!on || !ready) return null;

  return (
    <div
      data-gravity-undo
      className="absolute right-[var(--edge)] top-6 z-[60] flex min-h-11 items-center sm:top-[var(--frame-top)] sm:min-h-[calc(44*var(--u))]"
    >
      <button
        type="button"
        onClick={undo}
        aria-label="Undo gravity and put the page back"
        className="flex size-[calc(44*var(--u-full))] items-center justify-center text-foreground transition-colors duration-200 ease-out hover:text-accent"
      >
        {/* Solid, like the apple it stands in for: a band sweeping over from
            a tapered tail into a broad head. The head is stroked in its own
            colour too, which rounds its corners without growing the band. */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-[calc(26*var(--u-full))]"
          aria-hidden
        >
          <path
            d="M3.2 6.6 3.2 15.2 11.8 15.2Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M5.4 9.6C8.3 6.4 11.6 5.3 14.6 5.8C18.9 6.6 21.6 10.4 21.1 14.5C20.8 16.6 20.1 18.6 18.9 20.2C19.1 16.9 17.7 13.8 15 12.8C13.2 12.1 11.2 12.4 9.6 13.6Z" />
        </svg>
      </button>
    </div>
  );
}
