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
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* The sheet, with its top-left corner turned down, then the two inner
            edges of the turned-down flap. */}
        <path d="M8 2.75 3 7.75v11.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2V4.75a2 2 0 0 0-2-2Z" />
        <path d="M8 2.75v5H3" />
        {/* Writing on it, shortening down the page. */}
        <path d="M6.5 11.6h7M6.5 14.85h4.5M6.5 18.1h3.5" />
        {/* The pencil lies over the sheet, so it is drawn twice: once in the
            page colour and thick enough to open a gap in whatever it crosses,
            then again in the ink colour. That gap is what the reference draws
            as a white outline, and without it the sheet's edge and the lines
            underneath run straight through the pencil at this size. */}
        <path
          d="M18.6 7.35a1.1 1.1 0 0 1 1.55 1.55l-7.3 7.3-2.4.85.85-2.4Z"
          stroke="var(--background)"
          strokeWidth="3.6"
        />
        <path d="M18.6 7.35a1.1 1.1 0 0 1 1.55 1.55l-7.3 7.3-2.4.85.85-2.4Z" />
        <path d="M17.4 8.55l1.55 1.55" />
      </svg>
    </button>
  );
}
