"use client";

// ---------------------------------------------------------------------------
// The globe, at the foot of the top-right stack.
//
// A real button with nothing wired to it yet: it takes focus, it presses, and
// the click handler is the seam where its behaviour will go.
// ---------------------------------------------------------------------------

export function GlobeButton() {
  return (
    <button
      type="button"
      onClick={() => {
        // Nothing yet — this is where the globe's behaviour will go.
      }}
      aria-label="Globe"
      className="design-one-only flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition duration-200 ease-out hover:scale-110 hover:opacity-80"
    >
      {/* Drawn rather than filled so it holds up at 18px: the outline, the
          equator and the meridian straight through the middle, then a curved
          meridian and a latitude line either side of them. */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10.25" />
        <path d="M1.75 12h20.5M12 1.75v20.5" />
        <path d="M12 1.75c-3.21 2.77-5.04 6.43-5.04 10.25s1.83 7.48 5.04 10.25" />
        <path d="M12 1.75c3.21 2.77 5.04 6.43 5.04 10.25s-1.83 7.48-5.04 10.25" />
        <path d="M4.3 5.8c2.22 1.27 4.82 1.94 7.7 1.94s5.48-.66 7.7-1.94" />
        <path d="M4.3 18.2c2.22-1.27 4.82-1.94 7.7-1.94s5.48.66 7.7 1.94" />
      </svg>
    </button>
  );
}
