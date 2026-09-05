"use client";

// ---------------------------------------------------------------------------
// Opening a study on the homepage.
//
// A cover is the switch: press one and that project's study unfolds under its
// row, press it again and the row folds back to the picture and the line it
// was. A study stays open for as long as it is wanted — nothing but another
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

// --- the switch, read by the cover ----------------------------------------

type Toggle = { open: boolean; toggle: () => void };

const ToggleContext = createContext<Toggle | null>(null);

/**
 * The cover reads this to know whether it is a switch and which way it is
 * set. Null for a project with nothing written about it, and on any page that
 * is not the list — the cover falls back to its link there.
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
