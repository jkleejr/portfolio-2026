"use client";

// ---------------------------------------------------------------------------
// Opening a study on the homepage.
//
// A project's row is the switch — its cover, its name, and the room around
// them: press it and that project's study unfolds under it, press it again
// and the row folds back to the picture and the line it was. A study stays open for as long as it is wanted — nothing but another
// press closes it. The list is never left behind, and no page is ever loaded
// to read one.
//
// One at a time. The state is a single slug held for the whole list rather
// than a flag on each project, so opening the second closes the first: two
// studies open at once is a page with no list left in it.
//
// The writing itself stays on the server. What is passed in as `study` is the
// StudyBody the server already rendered; this file only decides whether it is
// on the page. See the note at the top of case-study.tsx.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { usePress } from "./press";

// --- the switch, read by the cover and the title ---------------------------

type Toggle = { open: boolean; toggle: () => void };

const ToggleContext = createContext<Toggle | null>(null);

/**
 * The cover and the title read this to know whether they are a switch and
 * which way it is set. Null for a project with nothing written about it, and
 * on any page that is not the list — both fall back to their link there.
 */
export function useCoverToggle() {
  return useContext(ToggleContext);
}

// --- the list -------------------------------------------------------------

const OpenContext = createContext<{
  openSlug: string | null;
  setOpenSlug: (slug: string | null) => void;
} | null>(null);

export function ProjectList({ children }: { children: React.ReactNode }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  return (
    <OpenContext.Provider value={{ openSlug, setOpenSlug }}>
      {/* The spacing of the closed list, unchanged: a study brings its own
          room above it and the 4rem below is what the next project already
          sat at. */}
      <div className="mt-16 flex flex-col items-start gap-16">{children}</div>
    </OpenContext.Provider>
  );
}

// --- one project ----------------------------------------------------------

export function ProjectSection({
  slug,
  study,
  children,
}: {
  slug: string;
  /** The rendered study, or nothing for a project without one. */
  study?: React.ReactNode;
  /** The project's row: its cover, its title, the line under it. */
  children: React.ReactNode;
}) {
  const list = useContext(OpenContext);
  const open = !!study && list?.openSlug === slug;

  const sectionRef = useRef<HTMLElement>(null);

  const toggle = useCallback(() => {
    if (!study) return;
    if (open) {
      // Closing takes away only what is under the row, and the cover was just
      // pressed, so the row is on the screen and stays exactly where it is.
      // Nothing to put back.
      list?.setOpenSlug(null);
      return;
    }
    // Opening this one closes whatever was open, and if that was a project
    // above this row, the row is about to jump up the window by the whole
    // height of a study — under the finger that just pressed it. So hold it
    // still: where it sat in the window before the press is where it sits
    // after, and the study unfolds from under it.
    const before = sectionRef.current?.getBoundingClientRect().top ?? null;
    list?.setOpenSlug(slug);
    if (before === null) return;
    requestAnimationFrame(() => {
      const after = sectionRef.current?.getBoundingClientRect().top;
      if (after !== undefined && after !== before) {
        window.scrollBy(0, after - before);
      }
    });
  }, [study, open, list, slug]);

  return (
    <section ref={sectionRef} className="w-full">
      <ToggleContext.Provider value={study ? { open, toggle } : null}>
        {children}
      </ToggleContext.Provider>
      {open && (
        // The study runs wider than the column the list is set in, and wider
        // on the right only — it keeps the left edge the covers hold and runs
        // on into the empty half of the window. See --study-width, which is
        // also what stops it running off the side.
        //
        // Only from the width where there is a right side worth having. Under
        // that it takes the column, which on a phone is the screen.
        <div className="mt-10 w-full min-[1000px]:w-[var(--study-width)]">
          {study}
        </div>
      )}
    </section>
  );
}

// --- the row ----------------------------------------------------------------

/**
 * The whole row as the switch: the cover, the name, the line under it, and
 * the room between and around them. Someone who wants to read about a project
 * presses at it rather than aiming at one thing in it, and a press that lands
 * in the gap between the picture and the name should not be a press on
 * nothing.
 *
 * The cover and the name stay buttons of their own. They are what the
 * keyboard and a screen reader reach, and the row is not made a button around
 * them — a button inside a button is not a thing the browser will have. So the
 * row listens for clicks instead, and steps aside for any that started on a
 * link or button inside it: the cover and the name have already switched the
 * study, and the marks after the name leave the page, which a press on them
 * should do without also opening something behind it.
 *
 * `group` is for the cover and the name, which take their hover from the row
 * rather than from themselves — see project-thumbnail.tsx and
 * project-title.tsx — so the whole row lights when any of it is under the
 * pointer, the way it all answers when any of it is pressed.
 */
export function ProjectRow({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const toggle = useCoverToggle();
  // A throw of the row is not a click on it — see press.ts.
  const { onPointerDown, dragged } = usePress();

  if (!toggle) {
    return <article className={className}>{children}</article>;
  }

  return (
    <article
      className={`group cursor-pointer ${className}`}
      onPointerDown={onPointerDown}
      onClick={(e) => {
        if ((e.target as Element).closest("a, button")) return;
        if (dragged(e)) return;
        toggle.toggle();
      }}
    >
      {children}
    </article>
  );
}
