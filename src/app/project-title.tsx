"use client";

// ---------------------------------------------------------------------------
// The name of a project on the homepage, as a way into what has been written
// about it.
//
// The cover beside it is the switch that opens a study under its row (see
// project-study.tsx), and the name is the same switch: a title is the first
// thing a reader goes for when they want to read more, and a name that does
// nothing when pressed reads as a page with nothing behind it. The two are one
// state — press either and the study opens, press either again and it closes.
//
// It is a link all the same, to the address the open study has — "/" plus the
// slug, see app/[slug]/page.tsx. A plain click never follows it: the study
// opens in place and the address is written to match. What the href is for is
// every other way of asking — cmd-click, the middle button, "open in new
// tab", "copy link" — which a button answers with nothing, and which someone
// lining up three projects in three tabs to read later reaches for first.
//
// Off the list, where there is no switch to read, it goes to the study's own
// page, as the cover does. The marks after the name — the App Store, the
// chain to a live site — stay their own links; they are the way out of the
// page and this is the way further into it.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { caseStudies } from "@/data/case-studies";
import { modified, usePress } from "./press";
import { useCoverToggle } from "./project-study";

export function ProjectTitle({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const study = caseStudies[slug];

  // A throw of the title is not a click on it — see press.ts.
  const { onPointerDown, dragged } = usePress();
  const toggle = useCoverToggle();

  // Turns the accent colour under the pointer, so the name reads as something
  // that can be pressed without being underlined like a link in a paragraph.
  // On the list the whole row is the switch, so the name
  // answers a hover anywhere in it (row-hover, from ProjectRow — see the
  // variant in globals.css for the one place in the row it does not) and not
  // only on its own letters.
  const press =
    "cursor-pointer text-left transition-colors duration-200 ease-out hover:text-accent row-hover:text-accent";

  if (study && toggle) {
    return (
      <Link
        href={`/${slug}`}
        // Nothing to fetch ahead of a click: a plain one never leaves the
        // page, and the ones that do are a fresh load in another tab.
        prefetch={false}
        // A link dragged is the browser's own drag of its address, which
        // would take the press away from a throw — see press.ts.
        draggable={false}
        aria-expanded={toggle.open}
        // Held in the accent colour for as long as its study is open, so the
        // name says which project the page is showing after the pointer has
        // moved on. Closing the study lets it go.
        className={`${press} ${toggle.open ? "text-accent" : ""}`}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) return e.preventDefault();
          if (modified(e)) return;
          e.preventDefault();
          toggle.toggle();
        }}
      >
        {children}
      </Link>
    );
  }

  if (study) {
    return (
      <Link
        href={`/projects/${slug}`}
        className={press}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) e.preventDefault();
        }}
      >
        {children}
      </Link>
    );
  }

  // A project with nothing written about it yet is a name and nothing more.
  return <>{children}</>;
}
