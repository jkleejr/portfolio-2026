"use client";

// ---------------------------------------------------------------------------
// A study's title, when the project it belongs to is live somewhere.
//
// The title itself is the way there, with a link mark after it so that reads
// as a link rather than as a heading that happens to be clickable. The mark is
// drawn rather than an image: it is one two-path glyph, it takes the colour of
// the text it sits beside, and it stays sharp at any size.
//
// A title that goes to an App Store listing instead keeps the same anchor and
// press guard but drops the glyph, since the App Store mark after it already
// says where it goes.
//
// A client component only because of the press guard — with gravity on, the
// title can be picked up and thrown, and the throw ends with the pointer
// released over it, which the browser reports as a click. See press.ts.
// ---------------------------------------------------------------------------

import { usePress } from "./press";
import { LinkGlyph } from "./link-glyph";

export function SiteLink({
  href,
  glyph = true,
  children,
}: {
  href: string;
  /** Whether the link mark follows the title. Off when another mark does. */
  glyph?: boolean;
  children: React.ReactNode;
}) {
  const { onPointerDown, dragged } = usePress();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onPointerDown={onPointerDown}
      onClick={(e) => {
        if (dragged(e)) e.preventDefault();
      }}
      className="inline-flex items-center gap-2 transition-opacity duration-200 ease-out hover:opacity-70"
    >
      {children}
      {/* Sized in em so it follows the title rather than a fixed number of
          pixels, and sat on the middle of the title's caps rather than the
          middle of its line box. */}
      {glyph && (
        <LinkGlyph className="h-[0.62em] w-[0.62em] shrink-0 translate-y-[0.09em]" />
      )}
    </a>
  );
}
