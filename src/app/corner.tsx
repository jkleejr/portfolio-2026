"use client";

// ---------------------------------------------------------------------------
// The About link and the apple, in the top-right corner.
//
// On the homepage they are part of the page's frame — they sit on the name's
// line and move with it when the frame is centred in a tall window — so the
// homepage draws them itself, inside that frame (see ProjectList). Every
// other page has them from the layout instead, pinned to the top of the band.
// SiteCorner is that layout copy, and it steps aside on the homepage's
// addresses so there is only ever one apple on the page.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { usePathname } from "next/navigation";
import { caseStudies } from "@/data/case-studies";
import { AppleButton } from "./apple-button";

/**
 * The row itself. The row is the apple's height, which is what --top-row on
 * the homepage measures to drop the name under it on a phone. From sm up
 * everything in it is measured in --u, so it scales with the page.
 */
export function Corner({ className = "" }: { className?: string }) {
  return (
    <div
      data-gravity="atom"
      className={`corner-stack absolute right-[var(--edge)] z-20 flex flex-row items-center gap-4 sm:gap-[calc(16*var(--u))] ${className}`}
    >
      <Link
        href="/about"
        className="text-lg font-medium text-foreground transition-colors duration-200 ease-out hover:text-accent sm:text-[calc(20*var(--u))]"
      >
        About
      </Link>
      <AppleButton />
    </div>
  );
}

/** "/" and "/<study>" are the homepage — see [slug]/page.tsx. */
function isHome(pathname: string) {
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  return slug === "" || slug in caseStudies;
}

/** The layout's copy, for every page but the homepage. */
export function SiteCorner() {
  const pathname = usePathname();
  if (isHome(pathname)) return null;
  return <Corner className="top-6 sm:top-[calc(24*var(--u))]" />;
}
