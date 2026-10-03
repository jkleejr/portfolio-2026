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

// How long a study is given to go out before it is taken off the page — the
// length of its animation in globals.css.
const LEAVE = 120;

const OpenContext = createContext<{
  openSlug: string | null;
  /** The study on its way out, still on the page. */
  leaving: string | null;
  /** A press on a project's cover. */
  press: (slug: string) => void;
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

export function ProjectList({
  header,
  studies,
  children,
}: {
  /** The name, the intro and the corner — everything in the frame above the
   *  strip. */
  header: React.ReactNode;
  /** Each project's rendered study, by slug. */
  studies: Record<string, React.ReactNode>;
  /** The covers, in order — one ProjectSection each. */
  children: React.ReactNode;
}) {
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

  // A press closes whatever study is open and opens the pressed one in its
  // place, or closes it if it was the one open. Whatever is open goes out
  // first, while it is still on the page — `leaving` — and the new one comes
  // up under the strip after it.
  const [leaving, setLeaving] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // What is open now, for a step that runs later to check it still holds: the
  // back button can change it in the 120ms between a press and its swap.
  const openNow = useRef(openSlug);
  useEffect(() => {
    openNow.current = openSlug;
  }, [openSlug]);

  const studyRef = useRef<HTMLDivElement>(null);

  const press = useCallback(
    (slug: string) => {
      if (leaving) return;
      const still = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const was = openSlug;
      const next = was === slug ? null : slug;

      const swap = () => {
        flushSync(() => {
          setOpenSlug(next);
          setLeaving(null);
        });
        // The study opens under the strip, which may be most of a screen
        // tall. If the start of it has landed low in the window, bring it up
        // so the press visibly did something.
        const box = studyRef.current?.getBoundingClientRect();
        if (next && box && box.top > window.innerHeight * 0.6) {
          studyRef.current?.scrollIntoView({
            behavior: still ? "auto" : "smooth",
            block: "start",
          });
        }
      };

      // Nothing to go out first, or no motion is wanted.
      if (!was || still) return swap();

      setLeaving(was);
      timers.current.push(
        setTimeout(() => {
          if (openNow.current !== was) return setLeaving(null);
          swap();
        }, LEAVE),
      );
    },
    [leaving, openSlug, setOpenSlug],
  );

  // Arriving at an address with a study in it — johnkleejr.com/loot-check —
  // lands on the list with that study open, and the page starts at the strip
  // with the study under it. On a hard load the script at the foot of the
  // body in layout.tsx has done this already, before hydration; this is for an
  // arrival by navigation.
  const stripRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (!first.current) return;
    first.current = false;
    if (openSlug) stripRef.current?.scrollIntoView({ block: "start" });
  }, [openSlug]);

  const study = openSlug ? studies[openSlug] : undefined;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useStripDrag(scrollerRef, trackRef, !!study);

  return (
    <OpenContext.Provider value={{ openSlug, leaving, press }}>
      {/* The frame — the name, the intro, the corner and the strip — and
          the open study under it.

          From sm up the frame is at least a window tall and its contents are
          centred in it, starting at --frame-top. Everything in it is measured in --u, so as the window
          narrows the whole picture shrinks, and centred it shrinks towards the
          middle of the window rather than up to the top of it. The study is
          outside the frame, so opening one does not move it.

          The frame's top is --frame-top, worked out in globals.css rather
          than left to flex to centre, so the layout can put the corner on the
          same line on every page — see corner.tsx. */}
      <div>
        <div
          // The white is a handle for the strip while nothing is open — see
          // useStripDrag — and the cursor says so.
          className={`sm:min-h-svh sm:pb-[calc(24*var(--u))] sm:pt-[var(--frame-top)] ${
            study ? "" : "cursor-grab"
          }`}
        >
          <div className="relative">
            {header}
            <div
              ref={stripRef}
              // For the layout script to start an open study's page at.
              data-strip
              // Out to both of the window's edges, past the band's: on a
              // window wider than the band the covers run on into the white
              // beside it rather than being cut off at the band's edge. The
              // margins are that white — --gutter — and come to nothing on a
              // window the band fills. The strip pads its start by the same
              // amount, so the first cover still starts on the name's line.
              className="-mx-[var(--gutter)] mt-16 scroll-mt-6 sm:mt-[calc(64*var(--u))]"
            >
              <CoverStrip scroller={scrollerRef} track={trackRef}>
                {children}
              </CoverStrip>
            </div>
          </div>
        </div>
        {study && (
          // In the column the rest of the page is set in, running wider on
          // the right from 1000px — see --study-width.
          <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
            <div
              ref={studyRef}
              // For the layout script to find the open study by.
              data-study
              // Room at the foot once the study is read: it is the last
              // thing on the page.
              className={`mt-10 w-full scroll-mt-6 pb-24 sm:pb-40 min-[1000px]:w-[var(--study-width)] ${
                leaving ? "study-out" : "study-in"
              }`}
            >
              {study}
            </div>
          </div>
        )}
      </div>
    </OpenContext.Provider>
  );
}

// --- the strip --------------------------------------------------------------

// How far the pointer has to travel, pressed, before it is a drag of the strip
// rather than a click on a cover.
const DRAG = 5;

// The glide after a drag is let go. The strip carries on at the speed the
// pointer was moving over the last VELOCITY_WINDOW ms, and loses a share of
// that speed every frame — FRICTION is what is kept per 60th of a second — so
// a flick runs on further than a slow drag, and both ease to a stop. Kept
// light: at a brisk 1px/ms the strip runs on about 200px. MAX_SPEED caps a
// wild flick, and under MIN_SPEED it has stopped.
const FRICTION = 0.92;
const VELOCITY_WINDOW = 80;
const MAX_SPEED = 3;
const MIN_SPEED = 0.02;

// The give at either end of the strip. Pushed past its first or last cover —
// by a trackpad, a drag, or a glide that runs into the end — the row moves on
// a little, against a resistance that grows the further it goes and never
// lets it past STRETCH, and springs back once let go. SETTLE is how long a
// trackpad has to be still before the row is counted as let go; the spring
// itself is .cover-track in globals.css.
const STRETCH = 100;
const SETTLE = 90;

/** How far the row shows for a push of `x` px past its end — iOS's curve:
 *  nearly one for one at first, flattening out towards STRETCH. */
const give = (x: number) => STRETCH * (1 - 1 / ((Math.abs(x) * 0.55) / STRETCH + 1));

/**
 * Moving the strip sideways by hand, and the give at its ends.
 *
 * Dragging with a mouse: a press on the strip itself always starts one.
 * While no study is open, so does a press anywhere else on the homepage that
 * is not on something to press — a link, a button, a film's controls: the
 * page is the name and the strip and white, and the white is a handle for the
 * strip. With a study open the white around it is the study's, and only the
 * strip drags. Listened for on the window, so a press out in the white beside
 * the band counts too, and the drag keeps going past the window's edge. A
 * drag that ends over a cover is not a click on it: the click the browser
 * sends at the end of one is caught on the way down and stopped. A press out
 * in the white has its default stopped, so dragging over the name does not
 * select it. Let go mid-drag and the strip glides on a little and eases to a
 * stop — see FRICTION.
 *
 * At either end the row gives rather than stopping dead — see STRETCH. The
 * scroll position stays at the end; what moves is the track inside the
 * strip, by a transform, so nothing is laid out again for it.
 */
function useStripDrag(
  scroller: React.RefObject<HTMLDivElement | null>,
  track: React.RefObject<HTMLDivElement | null>,
  studyOpen: boolean,
) {
  useEffect(() => {
    const root = document.documentElement;
    const still = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let drag: { x: number; left: number; moved: boolean } | null = null;
    let suppress = false;
    // The pointer's last few positions, for the speed it is let go at.
    let samples: { x: number; t: number }[] = [];
    let glide = 0;
    const stopGlide = () => {
      cancelAnimationFrame(glide);
      glide = 0;
    };

    // --- the give at the ends ---
    // `push` is how far past the end the reader has pushed, signed as the
    // row moves: positive past the start (the row shifts right), negative
    // past the end. The row shows give(push) of it.
    let push = 0;
    let settle = 0;
    let bounce = 0;
    const show = (springing: boolean) => {
      const el = track.current;
      if (!el) return;
      if (springing) el.dataset.spring = "";
      else delete el.dataset.spring;
      el.style.transform = push
        ? `translate3d(${Math.sign(push) * give(push)}px, 0, 0)`
        : "";
    };
    const release = () => {
      clearTimeout(settle);
      clearTimeout(bounce);
      if (!push) return;
      push = 0;
      show(true);
    };
    const max = (strip: HTMLDivElement) => strip.scrollWidth - strip.clientWidth;

    const startGlide = (strip: HTMLDivElement, speed: number) => {
      if (still()) return;
      let v = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed));
      let last = performance.now();
      const step = (now: number) => {
        const dt = now - last;
        last = now;
        const before = strip.scrollLeft;
        strip.scrollLeft = before - v * dt;
        v *= Math.pow(FRICTION, dt / (1000 / 60));
        if (Math.abs(v) < MIN_SPEED) {
          glide = 0;
          return;
        }
        // Run into an end: the speed it had left goes into a small bounce.
        if (strip.scrollLeft === before) {
          glide = 0;
          push = v * 120;
          show(false);
          bounce = window.setTimeout(release, 120);
          return;
        }
        glide = requestAnimationFrame(step);
      };
      glide = requestAnimationFrame(step);
    };

    const down = (e: PointerEvent) => {
      const strip = scroller.current;
      if (!strip || e.pointerType !== "mouse" || e.button !== 0) return;
      if (root.classList.contains("gravity-on")) return;
      const target = e.target as Element;
      if (!strip.contains(target)) {
        if (studyOpen) return;
        if (target.closest("a, button, input, textarea, select, video[controls], [data-study]")) return;
        e.preventDefault();
      }
      // A press catches a strip that is still gliding or giving.
      stopGlide();
      clearTimeout(bounce);
      drag = { x: e.clientX, left: strip.scrollLeft, moved: false };
      samples = [{ x: e.clientX, t: e.timeStamp }];
    };
    const move = (e: PointerEvent) => {
      const strip = scroller.current;
      if (!drag || !strip) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < DRAG) return;
      if (!drag.moved) {
        drag.moved = true;
        root.dataset.dragging = "";
      }
      // Where the drag would put the strip, and what is past either end of
      // it goes into the give.
      const want = drag.left - dx;
      const end = max(strip);
      strip.scrollLeft = Math.max(0, Math.min(end, want));
      push = want < 0 ? -want : want > end ? end - want : 0;
      show(false);
      samples.push({ x: e.clientX, t: e.timeStamp });
      while (samples.length > 2 && e.timeStamp - samples[0].t > VELOCITY_WINDOW)
        samples.shift();
    };
    const up = (e: PointerEvent) => {
      const moved = drag?.moved;
      drag = null;
      if (!moved) return;
      delete root.dataset.dragging;
      suppress = true;
      // A click follows the release only when it lands back on the element
      // it started on; clear the flag on the next turn either way.
      setTimeout(() => (suppress = false), 0);
      // Let go past an end, it springs back and does not glide.
      if (push) return release();
      // The speed over the last moments of the drag, in px/ms. Held still
      // before letting go, there is none, and the strip stays where it is.
      const first = samples[0];
      const last = samples[samples.length - 1];
      const span = last.t - first.t;
      const strip = scroller.current;
      if (strip && span > 0 && e.timeStamp - last.t < VELOCITY_WINDOW)
        startGlide(strip, (last.x - first.x) / span);
    };
    const click = (e: MouseEvent) => {
      if (!suppress) return;
      suppress = false;
      e.preventDefault();
      e.stopPropagation();
    };

    // A trackpad's sideways swipe. In the middle of the strip the browser
    // scrolls it as it always does. Pushed past an end — or while the row is
    // already out past one — the swipe goes into the give instead, and the
    // row springs back once the trackpad has been still for SETTLE ms, which
    // covers the run of slowing events a trackpad sends after the fingers
    // lift.
    const wheel = (e: WheelEvent) => {
      stopGlide();
      const strip = scroller.current;
      if (!strip || drag) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const end = max(strip);
      const atStart = strip.scrollLeft <= 0 && e.deltaX < 0;
      const atEnd = strip.scrollLeft >= end - 1 && e.deltaX > 0;
      if (!push && !atStart && !atEnd) return;
      e.preventDefault();
      if (still()) return;
      const next = push - e.deltaX;
      // Swiping back the other way takes the give in first, and never past
      // nothing into the other end's.
      push = push > 0 ? Math.max(0, next) : push < 0 ? Math.min(0, next) : next;
      show(false);
      clearTimeout(settle);
      settle = window.setTimeout(release, SETTLE);
    };

    const strip = scroller.current;
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("click", click, true);
    strip?.addEventListener("wheel", wheel, { passive: false });
    return () => {
      stopGlide();
      clearTimeout(settle);
      clearTimeout(bounce);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("click", click, true);
      strip?.removeEventListener("wheel", wheel);
      delete root.dataset.dragging;
    };
  }, [scroller, track, studyOpen]);
}

/**
 * Every project's cover, side by side in one row, in order. Wider than the
 * page once there are a few of them, and then it scrolls sideways: with a
 * trackpad's sideways swipe, a mouse's shift-wheel or a finger, natively,
 * and by dragging with a mouse — see useStripDrag. No scrollbar is drawn,
 * and a swipe at either end gives and springs back rather than turning into
 * the browser's back or forward — see .cover-strip in globals.css.
 *
 * The covers are on a track inside the scroll box, which is what moves for
 * the give at the ends.
 *
 * The first cover starts at --edge, the line the name starts on, and the
 * last keeps the same air at the far end. On a window wider than the band
 * the strip itself runs out to both of the window's edges and pads its start
 * by --gutter to keep that line — see ProjectList. The padding above and
 * below is room for a cover's lift under the pointer, which the scroll box
 * would otherwise clip.
 */
function CoverStrip({
  scroller,
  track,
  children,
}: {
  scroller: React.RefObject<HTMLDivElement | null>;
  track: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={scroller}
      role="region"
      aria-label="Projects"
      tabIndex={0}
      className="cover-strip flex overflow-x-auto py-4 pl-[calc(var(--edge)+var(--gutter))] pr-[var(--edge)] outline-none sm:py-[calc(16*var(--u))]"
    >
      <div
        ref={track}
        className="cover-track flex shrink-0 items-start gap-28 sm:gap-[calc(112*var(--u))]"
      >
        {children}
      </div>
    </div>
  );
}

// --- one project ----------------------------------------------------------

export function ProjectSection({
  slug,
  hasStudy,
  children,
}: {
  slug: string;
  /** Whether there is a study to open — a project without one is a cover. */
  hasStudy: boolean;
  /** The project's cover. */
  children: React.ReactNode;
}) {
  const list = useContext(OpenContext);
  const open = hasStudy && list?.openSlug === slug;

  // The press itself is the list's to carry out, since it may be another
  // project's study that has to go out first — see ProjectList.
  const toggle = useCallback(() => {
    if (hasStudy) list?.press(slug);
  }, [hasStudy, list, slug]);

  return (
    <section className="shrink-0">
      <ToggleContext.Provider value={hasStudy ? { open, toggle } : null}>
        {children}
      </ToggleContext.Provider>
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
