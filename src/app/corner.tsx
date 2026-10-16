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
import { useRef, useState } from "react";
import { AppleButton } from "./apple-button";
import { useGravity } from "./gravity";
import { UndoButton } from "./undo-button";

/**
 * The row is the apple's height, held there where the apple is left out so the
 * About link stays put, which is what --top-row on the homepage
 * measures to drop the name under it on a phone. From sm up the row is
 * measured in --u, so it scales with the page — all but the About link's
 * type, which holds the size it has at full width, as the apple does.
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
        // From sm up the row keeps to the band's --edge on every page, and
        // one height from the window's top at every window size — where
        // --frame-top puts the homepage's name on a laptop. So the Projects /
        // About toggle at its end is in exactly the same place on every page,
        // and resizing the window moves it only from side to side.
        className={`corner-stack absolute right-[var(--edge)] top-6 z-20 flex min-h-11 flex-row items-center gap-4 sm:top-[calc(24*var(--u-full))] sm:gap-[calc(16*var(--u))]`}
      >
        {/* A phone keeps the plain link, beside the name; the toggle is
            from sm up. */}
        {!onAbout && (
          <Link
            href="/about"
            className="text-lg font-medium text-muted transition-colors duration-200 ease-out hover:text-accent sm:hidden"
          >
            About
          </Link>
        )}
        {!onHome && !onAbout && (
          <AppleButton fixed={false} button={apple} on={on} toggle={toggle} />
        )}
        <PageToggle about={onAbout} home={path === ""} />
      </div>
      {/* The About page's apple, on its own. On a phone in the top right,
          as far in from the window's right edge as "Home > About" is from
          its left; from sm up, where the About page has no "Home > About",
          in its place at the top left, level with the toggle across from it
          and as far in from the window's left edge as the toggle is from its
          right — the band's --edge, plus the half of the window the band
          leaves on each side, plus the scrollbar on the right. Measured to the
          ink both ways: the
          apple's starts 13 --u-full inside its button, and the H's 1.5px
          inside its box. A piece of its own for gravity, as the row is. */}
      {onAbout && (
        <div
          data-gravity="atom"
          className="absolute right-[calc(var(--edge)+1.5px-13*var(--u-full)-(100vw-var(--scrollbar)-var(--page))/2-var(--scrollbar))] top-6 z-20 flex min-h-11 items-center sm:right-auto sm:left-[calc(var(--edge)+var(--scrollbar)-13*var(--u-full))] sm:top-[calc(24*var(--u-full))]"
        >
          <AppleButton fixed button={apple} on={on} toggle={toggle} />
        </div>
      )}
      {onAbout && <UndoButton on={on} undo={toggle} />}
    </>
  );
}

/**
 * Projects and About as one switch, from sm up: two halves in a rounded
 * track, and a pill under the page being shown that slides across to the
 * other when it is pressed. They are links — Projects to the homepage, About
 * to the About page — and a press on the page already showing does nothing.
 *
 * The corner is in the layout, so it stays on the screen while the page
 * under it changes: the pill moves the moment it is pressed and the new page
 * comes in under it, rather than the switch being drawn again in its new
 * state. Sized in --u-full, as the link it stands in for was, so it holds one
 * size at every window width.
 */
function PageToggle({ about, home }: { about: boolean; home: boolean }) {
  // Where the pill is headed, ahead of the address catching up with it —
  // good only while the page it was pressed on is still the one showing.
  const [going, setGoing] = useState<{ to: "projects" | "about"; from: boolean } | null>(
    null,
  );
  const on = going && going.from === about ? going.to : about ? "about" : "projects";
  const here = (e: React.MouseEvent, to: "projects" | "about", stay: boolean) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (stay) return e.preventDefault();
    setGoing({ to, from: about });
  };
  return (
    <nav aria-label="Pages" data-on={on} className="page-toggle">
      <span aria-hidden className="page-toggle-pill" />
      <Link
        href="/"
        aria-current={!about ? "page" : undefined}
        onClick={(e) => here(e, "projects", home)}
      >
        Projects
      </Link>
      <Link
        href="/about"
        aria-current={about ? "page" : undefined}
        onClick={(e) => here(e, "about", about)}
      >
        About
      </Link>
    </nav>
  );
}
