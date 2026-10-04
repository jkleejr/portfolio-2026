"use client";

// ---------------------------------------------------------------------------
// The About link and the apple, in the top-right corner of every page.
//
// From sm up it sits at --frame-top, the line the homepage's name starts on
// once its frame is centred in the window (see globals.css), and every page
// puts it there — so opening the About page, or coming back, leaves it where
// it was. On a phone it is 1.5rem from the top, as the page's own air is.
//
// The homepage, and the homepage with a study open at /[slug], keep the link
// and drop the apple, so gravity is not on offer there.
//
// The About page drops the link to itself and keeps the apple: the row is set
// from its right edge. And there the apple holds still at any window size.
// The page around it is set in fixed pixels, not in --u and not centred in
// the window, so an apple at --frame-top and scaled by --u would drift
// against it as the window changed. On About it is a fixed size, a fixed
// distance in from the band's edge, and level with the "Home > About" line.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppleButton } from "./apple-button";

/**
 * The row is the apple's height, held there where the apple is left out so the
 * About link stays put, which is what --top-row on the homepage
 * measures to drop the name under it on a phone. From sm up everything in it
 * is measured in --u, so it scales with the page.
 */
export function SiteCorner() {
  const path = usePathname().replace(/\/+$/, "");
  const onAbout = path === "/about";
  // "/" is the homepage, and one segment other than about is the homepage
  // with a study open — the same reading as the script in layout.tsx.
  const onHome =
    path === "" || (!onAbout && path.split("/").filter(Boolean).length === 1);
  return (
    <div
      data-gravity="atom"
      // On About, --u is pinned to 1px for the apple inside, so its size is
      // the 1440px page's at every width. The top and the right are set out
      // in pixels, since --frame-top and --edge are worked out at the root
      // and do not see the pin. 93px puts the 44px apple's middle on the
      // middle of the breadcrumb's 26px line, 102px down — see about/page.tsx.
      style={onAbout ? ({ "--u": "1px" } as React.CSSProperties) : undefined}
      className={`corner-stack absolute right-[var(--edge)] top-6 z-20 flex min-h-11 flex-row items-center gap-4 sm:min-h-[calc(44*var(--u))] sm:gap-[calc(16*var(--u))] ${
        onAbout ? "sm:right-12 sm:top-[93px]" : "sm:top-[var(--frame-top)]"
      }`}
    >
      {!onAbout && (
        <Link
          href="/about"
          className="text-lg font-medium text-foreground transition-colors duration-200 ease-out hover:text-accent sm:text-[calc(20*var(--u))]"
        >
          About
        </Link>
      )}
      {!onHome && <AppleButton />}
    </div>
  );
}
