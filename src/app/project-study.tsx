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
// Neither way is a cut. A study comes up into place under its row as it
// appears, and goes out before it is taken away, with the rows that were under
// it coming up after — see "Opening a study" in globals.css for the motion and
// ProjectSection for the order of it. The height is not what moves: a study is
// thousands of pixels of pictures, and unrolling that is the whole page laid
// out again for every frame of it, to show rows leaving at a speed that reads
// as a cut anyway.
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
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import { caseStudies } from "@/data/case-studies";
import { site } from "@/data/site";
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

// How long a study is given to go out before it is taken off the page, and
// how long the rows around it are marked as arriving. Each is the length of
// its animation in globals.css, and a beat over for the second so the mark is
// not taken off a frame before the last row has landed.
const LEAVE = 120;
const SETTLE = 420;

/**
 * The rows that have just landed somewhere new and are coming up into place.
 * `after` a study that was closed: the rows under it. `around` one that was
 * opened in place of another: every row but its own, which is under the
 * finger and is held still.
 */
type Settle = { slug: string; how: "after" | "around" } | null;

const OpenContext = createContext<{
  openSlug: string | null;
  /** The study on its way out, still on the page. */
  leaving: string | null;
  settle: Settle;
  /** A press on a project's row: `row` is the section it is in. */
  press: (slug: string, row: HTMLElement | null) => void;
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

  // The tab follows the study: "Loot Check - John Lee" while one is open,
  // the name alone when none is. A visit straight to /loot-check arrives
  // with that title already set by the route's metadata; this keeps it in
  // step from then on, across presses and the back button alike, which
  // move the address without asking the router for a new head.
  useEffect(() => {
    const study = openSlug ? caseStudies[openSlug] : undefined;
    document.title = study
      ? `${study.title} - ${site.titleName}`
      : site.titleName;
  }, [openSlug]);

  const setOpenSlug = useCallback((slug: string | null) => {
    setOpen(slug);
    // The native call rather than the router's: Next folds it into its own
    // history and keeps usePathname in step, and nothing is fetched or
    // re-rendered for it — the study is already on the page. A new entry each
    // time, so the back button undoes the last open or close.
    window.history.pushState(null, "", slug ? `/${slug}` : "/");
  }, []);

  // A press is up to three steps, and the order of them is the whole of how
  // it feels. Whatever study is open goes out first, while it is still on the
  // page — `leaving`. Then the page changes, all at once: that study is taken
  // off it and the pressed one, if it was another, is put on. And then what
  // has just landed somewhere new comes up into place — `settle`.
  //
  // The first step is the same whether the press closes the open study or
  // opens another in its place. It used to be only the first of those, and a
  // study closed by another opening was simply gone between two frames.
  const [leaving, setLeaving] = useState<string | null>(null);
  const [settle, setSettle] = useState<Settle>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // What is open now, for a step that runs later to check it still holds: the
  // back button can change it in the 120ms between a press and its swap.
  const openNow = useRef(openSlug);
  useEffect(() => {
    openNow.current = openSlug;
  }, [openSlug]);

  const press = useCallback(
    (slug: string, row: HTMLElement | null) => {
      if (leaving) return;
      const later = (run: () => void, ms: number) =>
        timers.current.push(setTimeout(run, ms));
      // Asked for no motion, every step is a cut, as it was before any of this.
      const still = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const was = openSlug;

      const swap = (next: string | null, how: "after" | "around" | null) => {
        // Opening one study closes whatever was open, and if that was a
        // project above this row, the row is about to jump up the window by
        // the whole height of a study — under the finger that just pressed
        // it. So hold it still: where it sat in the window before is where it
        // sits after, and the study unfolds from under it. flushSync so the
        // page has changed by the next line, and the scroll is put right in
        // the same frame rather than the one after.
        const before = row?.getBoundingClientRect().top;
        flushSync(() => {
          setOpenSlug(next);
          setLeaving(null);
          setSettle(how && !still ? { slug, how } : null);
        });
        const after = row?.getBoundingClientRect().top;
        if (next && before !== undefined && after !== undefined) {
          if (after !== before) window.scrollBy(0, after - before);
        }
        if (how && !still) later(() => setSettle(null), SETTLE);
      };

      // Nothing to go out first: nothing is open, or no motion is wanted.
      if (!was || still) return swap(was === slug ? null : slug, null);

      // Or what is open is not in the window to be seen going out. A reader
      // who has scrolled clear of the open study and pressed another project
      // would be kept waiting on a fade that is happening off the screen, and
      // a press that does nothing for a beat is what reads as lag.
      const showing = document.querySelector("[data-study]");
      const box = showing?.getBoundingClientRect();
      const seen = box && box.bottom > 0 && box.top < window.innerHeight;
      if (!seen) return swap(was === slug ? null : slug, was === slug ? "after" : "around");

      setLeaving(was);
      later(() => {
        if (openNow.current !== was) return setLeaving(null);
        // Closing takes away only what is under the row, and the row was
        // just pressed, so it is on the screen and stays where it is.
        if (was === slug) swap(null, "after");
        else swap(slug, "around");
      }, LEAVE);
    },
    [leaving, openSlug, setOpenSlug],
  );

  return (
    <OpenContext.Provider value={{ openSlug, leaving, settle, press }}>
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
  // rather than at the top with the study somewhere below, or wherever the
  // page was scrolled to before a reload (the route switches the browser's
  // own restoration off for that — see app/[slug]/page.tsx). Once, on the
  // first paint: a study opened by a press is under the finger already and
  // is held still by the toggle below, and a back or forward that opens one
  // is a return to where the reader was.
  const first = useRef(true);
  useEffect(() => {
    if (!first.current) return;
    first.current = false;
    if (open) sectionRef.current?.scrollIntoView({ block: "start" });
  }, [open]);

  // The press itself is the list's to carry out, since it may be another
  // project's study that has to go out first — see ProjectList.
  const toggle = useCallback(() => {
    if (study) list?.press(slug, sectionRef.current);
  }, [study, list, slug]);

  const leaving = list?.leaving === slug;
  const settle = list?.settle;

  return (
    // scroll-mt is the room left over the row when the page starts at it.
    <section
      ref={sectionRef}
      // The marks the motion in globals.css reads. data-settled is on the row
      // whose study was just closed, and it is the rows after it that come up
      // into place. data-arrive is on every row but the one just opened in
      // place of another: they have all landed somewhere new, where that one
      // is under the finger and has been held still.
      data-settled={
        settle?.how === "after" && settle.slug === slug ? "" : undefined
      }
      data-arrive={
        settle?.how === "around" && settle.slug !== slug ? "" : undefined
      }
      className="w-full scroll-mt-6"
    >
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
        <div
          // For the list to find the open study by — see `press`.
          data-study
          className={`mt-10 w-full min-[1000px]:w-[var(--study-width)] ${
            leaving ? "study-out" : "study-in"
          }`}
        >
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
 * The cover and the name stay links of their own, to the address the open
 * study has. They are what the keyboard and a screen reader reach, and what a
 * cmd-click or "open in new tab" lands on, and the row is not made a link
 * around them — a link inside a link is not a thing the browser will have. So
 * the row listens for clicks instead, and steps aside for any that started on
 * a link or button inside it: the cover and the name have already switched
 * the study, and the marks after the name leave the page, which a press on
 * them should do without also opening something behind it. It steps aside
 * for the facts out in the margin too (data-own-hover) — they are set beside
 * the row and are in it for that reason only, and are not a thing to press.
 *
 * `group` is for the cover and the name, which take their hover from the row
 * (the row-hover variant in globals.css) rather than from themselves — see project-thumbnail.tsx and
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
        if ((e.target as Element).closest("a, button, [data-own-hover]")) return;
        if (dragged(e)) return;
        toggle.toggle();
      }}
    >
      {children}
    </article>
  );
}
