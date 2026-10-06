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
// The About page drops the link to itself and keeps the apple, in the same
// place as everywhere else — level with its "Home > About" in the opposite
// corner, which is set where an open study's way back is. There it holds one
// size at every window width, as the page's contact links do. Once it has
// been pressed, an undo arrow turns up in its place — see undo-button.tsx.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { AppleButton } from "./apple-button";
import { useGravity } from "./gravity";
import { UndoButton } from "./undo-button";

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
  // The switch is held here rather than in the apple, so the undo beside the
  // stack can throw it back too.
  const apple = useRef<HTMLButtonElement>(null);
  const { on, toggle } = useGravity(apple);
  return (
    <>
      <div
        data-gravity="atom"
        className="corner-stack absolute right-[var(--edge)] top-6 z-20 flex min-h-11 flex-row items-center gap-4 sm:top-[var(--frame-top)] sm:min-h-[calc(44*var(--u))] sm:gap-[calc(16*var(--u))]"
      >
        {!onAbout && (
          <Link
            href="/about"
            className="text-lg font-medium text-foreground transition-colors duration-200 ease-out hover:text-accent sm:text-[calc(20*var(--u))]"
          >
            About
          </Link>
        )}
        {!onHome && (
          <AppleButton fixed={onAbout} button={apple} on={on} toggle={toggle} />
        )}
      </div>
      {onAbout && <UndoButton on={on} undo={toggle} />}
    </>
  );
}
