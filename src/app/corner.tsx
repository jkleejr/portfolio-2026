"use client";

// ---------------------------------------------------------------------------
// The About link and the apple, in the top-right corner of every page.
//
// From sm up it sits at --frame-top, the line the homepage's name starts on
// once its frame is centred in the window (see globals.css), and every page
// puts it there — so opening the About page, or coming back, leaves it where
// it was. On a phone it is 1.5rem from the top, as the page's own air is.
//
// The About page drops the link to itself and keeps the apple, which stays
// where it is: the row is set from its right edge.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppleButton } from "./apple-button";

/**
 * The row is the apple's height, which is what --top-row on the homepage
 * measures to drop the name under it on a phone. From sm up everything in it
 * is measured in --u, so it scales with the page.
 */
export function SiteCorner() {
  const onAbout = usePathname().replace(/\/+$/, "") === "/about";
  return (
    <div
      data-gravity="atom"
      className="corner-stack absolute right-[var(--edge)] top-6 z-20 flex flex-row items-center gap-4 sm:top-[var(--frame-top)] sm:gap-[calc(16*var(--u))]"
    >
      {!onAbout && (
        <Link
          href="/about"
          className="text-lg font-medium text-foreground transition-colors duration-200 ease-out hover:text-accent sm:text-[calc(20*var(--u))]"
        >
          About
        </Link>
      )}
      <AppleButton />
    </div>
  );
}
