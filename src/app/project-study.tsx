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
// The open study is in the address — "/" plus its slug — so it can be shared
// and comes back on reload, and the back button closes it. See ProjectList.
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
import { usePathname } from "next/navigation";
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

/**
 * The open project, read off the address. The homepage is "/", and a project
 * open on it is "/" plus its slug — johnkleejr.com/loot-check — which is also
 * a page of its own (see app/[slug]/page.tsx), so the address can be shared
 * and lands on the list with that study open.
 */
function slugFromPath(pathname: string): string | null {
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  return slug || null;
}

export function ProjectList({ children }: { children: React.ReactNode }) {
  // The address is the record of which study is open, and the state here is
  // what the page draws from. Two copies rather than one because opening a
  // study has to be instant — the row is measured on the very next frame to
  // hold it still, see ProjectSection — and a change that went through the
  // router first would land a beat later than that. So the state is set
  // directly and the address is written to match; and when the address moves
  // on its own, under the back and forward buttons, the state follows it —
  // set during the render that sees the new address rather than in an effect
  // after it, so the page never draws a frame of the old one.
  const pathname = usePathname();
  const fromUrl = slugFromPath(pathname);
  const [openSlug, setOpen] = useState<string | null>(fromUrl);
  const [seenUrl, setSeenUrl] = useState(fromUrl);
  if (fromUrl !== seenUrl) {
    setSeenUrl(fromUrl);
    setOpen(fromUrl);
  }

  const setOpenSlug = useCallback((slug: string | null) => {
    setOpen(slug);
    // The native call rather than the router's: Next folds it into its own
    // history and keeps usePathname in step, and nothing is fetched or
    // re-rendered for it — the study is already on the page. A new entry each
    // time, so the back button undoes the last open or close.
    window.history.pushState(null, "", slug ? `/${slug}` : "/");
  }, []);

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

  // Arriving at an address with a study in it — johnkleejr.com/loot-check —
  // lands on the list with that study open, and the page should start at it
  // rather than at the top with the study somewhere below. Once, on the first
  // paint: a study opened by a press is under the finger already and is held
  // still by the toggle below, and a back or forward that opens one is a
  // return to where the reader was.
  const first = useRef(true);
  useEffect(() => {
    if (!first.current) return;
    first.current = false;
    if (open) sectionRef.current?.scrollIntoView({ block: "start" });
  }, [open]);

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
    // scroll-mt is the room left over the row when the page starts at it.
    <section ref={sectionRef} className="w-full scroll-mt-6">
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
