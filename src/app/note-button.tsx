"use client";

// ---------------------------------------------------------------------------
// The pencil, at the foot of the top-right stack. It opens the blog, and on
// the blog it is the way back.
//
// Built the same way as the design toggle, and for the same reason: the switch
// is a `data-view` attribute on <html> rather than React state, so the stored
// choice that the inline script in layout.tsx applies lands before first paint
// with no flash of the page you were not on. Both labels are rendered and CSS
// picks one, so the button reads correctly to a screen reader before hydration
// too — the same trick the theme toggle uses for its sun and moon.
// ---------------------------------------------------------------------------

export function NoteButton() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-view") === "blog" ? "home" : "blog";
    root.setAttribute("data-view", next);
    localStorage.setItem("view", next);
    window.scrollTo({ top: 0 });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="note-button design-one-only flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition duration-200 ease-out hover:scale-110 hover:opacity-80"
    >
      <span className="note-label-open sr-only">Open the blog</span>
      <span className="note-label-close sr-only">Back to the portfolio</span>
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
