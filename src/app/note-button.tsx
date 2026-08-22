"use client";

// ---------------------------------------------------------------------------
// The note, at the foot of the top-right stack.
//
// A real button with nothing wired to it yet, same as the globe: it takes
// focus, it presses, and the click handler is the seam where its behaviour
// will go.
// ---------------------------------------------------------------------------

export function NoteButton() {
  return (
    <button
      type="button"
      onClick={() => {
        // Nothing yet — this is where the note's behaviour will go.
      }}
      aria-label="Notes"
      className="design-one-only flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition duration-200 ease-out hover:scale-110 hover:opacity-80"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        {/* The pencil is laid out along its own axis — a -42 degree diagonal,
            3.5 wide — so the barrel, the eraser and the sharpened cone all
            line up by construction. The outer transform then scales that
            drawing up to fill the box and centres it, which is why the
            numbers below are the shape's own and not the box's. */}
        <g transform="translate(-3.45 -1.96) scale(1.29)">
          {/* Barrel. Its far end stops short of the eraser, and the gap left
              between them is the band the reference leaves unpainted. */}
          <rect
            x="5.54"
            y="9.7"
            width="11.75"
            height="3.5"
            transform="rotate(-42.1 11.41 11.45)"
          />
          {/* Eraser, rounded off at the end. */}
          <rect
            x="15.74"
            y="4.53"
            width="2.8"
            height="3.5"
            rx="0.55"
            transform="rotate(-42.1 17.14 6.28)"
          />
          {/* The sharpened cone, and the bare wood cut back out of it — that
              cut is what leaves a rim down both edges and the graphite at the
              point, rather than one solid wedge. */}
          <path d="M5.88 14.09 8.22 16.69 4.6 17.6Z" />
          <path
            d="M6.48 14.09 7.78 15.54 5.71 16.6Z"
            fill="var(--background)"
          />
        </g>
      </svg>
    </button>
  );
}
