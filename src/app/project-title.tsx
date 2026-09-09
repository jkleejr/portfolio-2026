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
// Off the list, where there is no switch to read, it goes to the study's own
// page, as the cover does. The marks after the name — the App Store, the
// chain to a live site — stay their own links; they are the way out of the
// page and this is the way further into it.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { caseStudies } from "@/data/case-studies";
import { usePress } from "./press";
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
  // that can be pressed without being dressed as a link — nothing is being
  // navigated to. On the list the whole row is the switch, so the name
  // answers a hover anywhere in it (group-hover, from ProjectRow) and not
  // only on its own letters.
  const press =
    "cursor-pointer text-left transition-colors duration-200 ease-out hover:text-accent group-hover:text-accent";

  if (study && toggle) {
    return (
      <button
        type="button"
        aria-expanded={toggle.open}
        // Held in the accent colour for as long as its study is open, so the
        // name says which project the page is showing after the pointer has
        // moved on. Closing the study lets it go.
        className={`${press} ${toggle.open ? "text-accent" : ""}`}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) return;
          toggle.toggle();
        }}
      >
        {children}
      </button>
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
