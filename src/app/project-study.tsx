"use client";

// ---------------------------------------------------------------------------
// Opening a study on the homepage.
//
// A cover is the switch: press one and that project's study unfolds under its
// row, press it again — or read to the end of it — and the row folds back to
// the picture and the line it was. The list is never left behind, and no page
// is ever loaded to read one.
//
// One at a time. The state is a single slug held for the whole list rather
// than a flag on each project, so opening the second closes the first: two
// studies open at once is a page with no list left in it.
//
// The writing itself stays on the server. What is passed in as `study` is the
// StudyBody the server already rendered; this file only decides whether it is
// on the page. See the note at the top of case-study.tsx.
// ---------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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

/**
 * How far up the window the end of a study has to come before it counts as
 * read. At the very bottom edge it has only appeared — the last screenful is
 * still ahead of the reader — so the fold waits until that end has risen into
 * the top three quarters of the window.
 */
const READ_TO = 0.75;

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
  const studyRef = useRef<HTMLDivElement>(null);

  // Folding up moves everything below the study a screen or more up the page,
  // and the reader is at the bottom of it when that happens — so the scroll
  // has to be put back deliberately or they land somewhere they never went.
  // The row is where they started, and where the picture they pressed is, so
  // that is where they are put down: its top, with a little air above it.
  const close = useCallback(() => {
    const el = sectionRef.current;
    const top = el ? el.getBoundingClientRect().top + window.scrollY : null;
    list?.setOpenSlug(null);
    if (top === null) return;
    // After the paint that takes the study off the page — before it, the
    // document is still its old height and the browser clamps the scroll.
    requestAnimationFrame(() => {
      window.scrollTo({ top: Math.max(top - 32, 0), behavior: "auto" });
    });
  }, [list]);

  const toggle = useCallback(() => {
    if (!study) return;
    if (open) return close();
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
  }, [study, open, close, list, slug]);

  // Reading to the end closes it. The alternative is a reader who finishes a
  // study and has to find their way back up to the picture to put it away.
  useEffect(() => {
    if (!open) return;
    const body = studyRef.current;
    if (!body) return;

    // A study shorter than the window is wholly on screen the moment it
    // opens: its end cannot be reached, only seen, and folding it up the
    // instant a reader nudged the page would be a trapdoor. Those wait for
    // the cover to be pressed again.
    if (body.offsetHeight < window.innerHeight) return;

    // Not until the reader has moved. The press that opened the study is not
    // a scroll, but the layout shift under it can be, and an unarmed handler
    // would fold the study up before a word of it was read.
    let armed = false;
    let frame = 0;

    const onScroll = () => {
      if (!armed) {
        armed = true;
        return;
      }
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = studyRef.current;
        if (!el) return;
        const end = el.getBoundingClientRect().bottom;
        // The foot of the page counts as the end however far up the window it
        // is: for the last project there may be nothing below the study to
        // scroll, and a study that cannot be finished cannot be closed.
        const atFoot =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2;
        if (end <= window.innerHeight * READ_TO || atFoot) close();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [open, close]);

  return (
    <section ref={sectionRef} className="w-full">
      <ToggleContext.Provider value={study ? { open, toggle } : null}>
        {children}
      </ToggleContext.Provider>
      {open && (
        // The study runs the width of the whole column rather than the writing
        // half of the row: a shot in it is the size it is at
        // /projects/[slug], and the prose keeps the measure it was written to.
        <div ref={studyRef} className="mt-10">
          {study}
        </div>
      )}
    </section>
  );
}

// --- the three lines of fact ----------------------------------------------

/**
 * The date, the role and the scope, printed beside the cover while the study
 * is open and nowhere at all while it is closed. They belong under the title
 * they describe, and the closed list is a list — a project on it says what it
 * is in one line and no more.
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
  return (
    <>
      {date && <p className="mt-3 text-base leading-relaxed">{date}</p>}
      {status && <p className="mt-1 text-base leading-relaxed">{status}</p>}
      {role && <p className="mt-1 text-base leading-relaxed">{role}</p>}
      {scope && <p className="mt-1 text-base leading-relaxed">{scope}</p>}
    </>
  );
}
