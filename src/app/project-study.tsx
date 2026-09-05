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
        // The study runs the width of the whole column rather than the writing
        // half of the row: a shot in it is the size it is at
        // /projects/[slug], and the prose keeps the measure it was written to.
        <div className="mt-10">
          {study}
        </div>
      )}
    </section>
  );
}

// --- the three lines of fact ----------------------------------------------

/**
 * The date, the role and the scope, printed while the study is open and
 * nowhere at all while it is closed — the closed list is a list, and a project
 * on it says what it is in one line and no more.
 *
 * Where there is a margin to put them in they are set out in it, past the left
 * edge of the cover, ranged right against it and level with the middle of the
 * picture. Nothing else on the page leaves the column, and that is the point:
 * the column is the study, and these are notes about the project rather than
 * part of what was written about it. It also buys the study back the three
 * lines they took off the top of it.
 *
 * The margin has to be wide enough to hold them. Below 1000px it is not —
 * around 125px of it is left after the air at each end, and less than that
 * turns "Product Design, iOS Development" into a stack of single words — so
 * under that width they stay in the column, under the line saying what the
 * project is. The width itself is --margin-note in globals.css.
 */
export function StudyFacts({
  date,
  status,
  role,
  scope,
}: {
  date?: string;
  status?: string;
  role?: string;
  scope?: string;
}) {
  const toggle = useCoverToggle();
  if (!toggle?.open) return null;

  // Ranged right in the margin, ranged left in the column: each way, the
  // lines start at the edge nearest what they belong to.
  const facts = (align: string) => (
    <>
      {date && <p className={`text-base leading-relaxed ${align}`}>{date}</p>}
      {status && (
        <p className={`mt-1 text-base leading-relaxed ${align}`}>{status}</p>
      )}
      {role && (
        <p className={`mt-1 text-base leading-relaxed ${align}`}>{role}</p>
      )}
      {scope && (
        <p className={`mt-1 text-base leading-relaxed ${align}`}>{scope}</p>
      )}
    </>
  );

  return (
    <>
      {/* right-full puts its right edge on the left edge of the row, which is
          the left edge of the cover; the margin holds it off from there. It is
          placed against the row rather than against the cover itself because
          the row is the positioned box — see `relative` on the article in
          design-one.tsx — and with the row no taller than the cover, its
          middle is the cover's middle. */}
      <div className="absolute right-full top-1/2 mr-6 hidden w-[var(--margin-note)] -translate-y-1/2 text-right min-[1000px]:block">
        {facts("text-right")}
      </div>
      <div className="mt-3 min-[1000px]:hidden">{facts("")}</div>
    </>
  );
}
