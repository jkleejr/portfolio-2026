"use client";

// ---------------------------------------------------------------------------
// Opening a study on the homepage.
//
// The homepage is the strip of covers. Press one and it grows: the cover
// itself moves and scales, right where it is, up to a large place right of
// centre — a recording playing on through it — while the covers either side
// slide away and the name and corner fade. The study's name and facts come
// up on the left of it, and the study itself is below, a scroll away. The
// arrow at the top left puts it all back: the cover shrinks into its place
// in the strip and the rest returns round it. See ProjectList.
//
// The open study is in the address — "/" plus its slug — so it can be shared
// and comes back on reload, and the back button closes it. See ProjectList.
//
// One at a time. The state is a single slug held for the whole list rather
// than a flag on each project.
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
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { caseStudies } from "@/data/case-studies";
import { site } from "@/data/site";
import { modified, usePress } from "./press";

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

// How long after a sideways swipe a scroll down is still taken to be part of
// it, rather than a scroll down to open a study.
const SIDEWAYS_QUIET = 500;

// How long the cover takes to grow into place, or shrink back — the length of
// the transition on the strip's sections in globals.css.
const GROW = 650;

// How far a swipe or a drag has to go, in px, to move from one open study to
// the next, and how long after one move before another is taken — long
// enough that one swipe does not count twice, short of the whole animation
// so a quick run of swipes is not held up by it.
const SWIPE_STEP = 60;
const SWIPE_REST = 300;

// How far a pull down from the top of a study's first screen has to go, in
// px of swipe, to put the study away and go back to the homepage.
const PULL_CLOSE = 120;

const OpenContext = createContext<{
  openSlug: string | null;
  /** A press on a project's cover: opens it, if it is not already open. */
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

/**
 * Whether the window is sm or wider: the strip of covers, growing into a
 * study. Under sm, on a phone, the homepage is the list of rows it was before
 * the strip — see MobileList — and each of the two leaves the address alone
 * at the other's widths. On the server, and in the first render after it, it
 * is taken to be the wide one.
 */
const WIDE = "(min-width: 40rem)";
function useIsWide() {
  return useSyncExternalStore(
    (change) => {
      const q = window.matchMedia(WIDE);
      q.addEventListener("change", change);
      return () => q.removeEventListener("change", change);
    },
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
}

/** The study the address has open, and a way to change it — shared by the
 *  strip and the phone's list, which read the same address. */
function useAddressedSlug() {
  const pathname = usePathname();
  const fromUrl = slugFromPath(pathname);
  const [slug, setSlug] = useState<string | null>(fromUrl);
  const [seenUrl, setSeenUrl] = useState(fromUrl);
  if (fromUrl !== seenUrl) {
    setSeenUrl(fromUrl);
    setSlug(fromUrl);
  }
  // The tab follows the study: "Loot Check - John Lee" while one is open,
  // the name alone when none is.
  useEffect(() => {
    const study = slug ? caseStudies[slug] : undefined;
    document.title = study ? `${study.title} - ${site.titleName}` : site.titleName;
  }, [slug]);
  const write = useCallback((next: string | null) => {
    setSlug(next);
    // The native call rather than the router's: Next folds it into its own
    // history and keeps usePathname in step, and nothing is fetched for it.
    // A new entry each time, so the back button undoes the last open.
    window.history.pushState(null, "", next ? `/${next}` : "/");
  }, []);
  return [slug, setSlug, write] as const;
}

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Where an opened cover grows to, as the transform that takes it there from
 * where it sits in the strip. Large — most of the window's height, or a bit
 * over half the page's width for a wide picture — and right of centre, leaving
 * the left of the window to the study's name and facts. On a phone, centred
 * and a little smaller. Worked out against the frame's top, not the window's,
 * so it holds wherever the page is scrolled to.
 */
function growTo(el: HTMLElement, frame: HTMLElement) {
  const r = el.getBoundingClientRect();
  const root = document.documentElement;
  const vw = root.clientWidth;
  const vh = window.innerHeight;
  const page = Math.min(vw, 1287);
  const bandLeft = (vw - page) / 2;
  const edge = parseFloat(getComputedStyle(root).getPropertyValue("--edge")) || 24;
  const phone = vw < 640;
  const scale = Math.min(
    (vh * (phone ? 0.7 : 0.8)) / r.height,
    (phone ? vw - 2 * edge : page * 0.58) / r.width,
  );
  const w = r.width * scale;
  const h = r.height * scale;
  const cx = phone
    ? vw / 2
    : Math.min(bandLeft + page * 0.62, bandLeft + page - edge - w / 2);
  const frameTop = frame.getBoundingClientRect().top + window.scrollY;
  const left = cx - w / 2;
  const top = frameTop + vh / 2 - h / 2;
  return {
    transform: `translate(${left - r.left}px, ${top - (r.top + window.scrollY)}px) scale(${scale})`,
    // Where the cover's left edge lands, from the band's — the room the
    // study's name has to its left.
    heroLeft: left - bandLeft,
  };
}

export function ProjectList({
  header,
  intros,
  studies,
  children,
}: {
  /** The name, the intro and the corner — everything in the frame above the
   *  strip. */
  header: React.ReactNode;
  /** Each project's name, line and facts, by slug — set beside its cover
   *  when it is open. */
  intros: Record<string, React.ReactNode>;
  /** Each project's rendered study, by slug. */
  studies: Record<string, React.ReactNode>;
  /** The covers, in order — one ProjectSection each. */
  children: React.ReactNode;
}) {
  // The address is the record of which study is open, and the state here is
  // what the page draws from. The state is set directly and the address
  // written to match; and when the address moves on its own, under the back
  // and forward buttons, the state follows it — set during the render that
  // sees the new address, so the page never draws a frame of the old one.
  //
  // Only from sm up: on a phone the list of rows has the address, and the
  // strip, out of sight, is left closed.
  const wide = useIsWide();
  const [addressed, setOpen, setOpenSlug] = useAddressedSlug();
  const openSlug = wide ? addressed : null;

  // What is on the page: the open study, or while one closes, the one going.
  // It stays until its cover is back in the strip, so the page does not lose
  // its height under the reader mid-way.
  const [closing, setClosing] = useState<string | null>(null);
  const shown = openSlug ?? closing;

  const press = useCallback(
    (slug: string) => {
      if (slug === openSlug || closing) return;
      setOpenSlug(slug);
    },
    [openSlug, closing, setOpenSlug],
  );
  const close = useCallback(() => setOpenSlug(null), [setOpenSlug]);

  const frameRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slackRef = useRef<HTMLDivElement>(null);
  useStripDrag(scrollerRef, trackRef, slackRef, !!shown);

  // --- growing a cover into place, and back ---
  //
  // The cover is not swapped for a larger copy: the one in the strip is moved
  // and scaled where it is, so a recording plays on through it without a
  // break. While a study is open the strip stops clipping what is in it —
  // overflow: clip rather than a scroll box — so the grown cover is not cut
  // off by the strip's edges; that drops the strip's scroll position, and the
  // track is shifted by the same amount to hold everything where it was. The
  // covers either side slide away and fade, and the name and the corner fade
  // with them.
  const prev = useRef<string | null>(null);
  const savedLeft = useRef(0);
  const firstRun = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const strip = scrollerRef.current;
    const track = trackRef.current;
    const slack = slackRef.current;
    if (!frame || !strip || !track || !slack) return;
    const root = document.documentElement;
    const was = prev.current;
    const now = openSlug;
    prev.current = now;
    const animate = !firstRun.current && !reducedMotion();
    firstRun.current = false;
    if (was === now) return;

    const sections = [...strip.querySelectorAll<HTMLElement>("section[data-slug]")];
    const sectionOf = (slug: string) =>
      sections.find((el) => el.dataset.slug === slug);

    const enterClip = () => {
      if (strip.dataset.clip !== undefined) return;
      savedLeft.current = strip.scrollLeft;
      delete track.dataset.spring;
      strip.dataset.clip = "";
      slack.dataset.clip = "";
      track.style.transform = `translate3d(${-savedLeft.current}px, 0, 0)`;
    };
    const leaveClip = () => {
      delete strip.dataset.clip;
      delete slack.dataset.clip;
      track.style.transform = "";
      strip.scrollLeft = savedLeft.current;
      slack.scrollLeft = SLACK;
    };
    const place = (slug: string, moving: boolean) => {
      const el = sectionOf(slug);
      if (!el) return;
      const i = sections.indexOf(el);
      // Where it is now: in the strip, or — when one study takes another's
      // place — put away to one side. Measured with neither, as it lies in
      // the strip, since that is what the grown place is worked out from;
      // then put back where it was, to grow from there.
      const side = el.dataset.away;
      el.style.transition = "none";
      delete el.dataset.away;
      el.style.transform = "";
      const { transform, heroLeft } = growTo(el, frame);
      if (moving && side) el.dataset.away = side;
      void el.offsetWidth;
      el.style.transition = moving ? "" : "none";
      delete el.dataset.away;
      sections.forEach((other, j) => {
        if (j === i) return;
        other.dataset.away = j < i ? "left" : "right";
      });
      el.dataset.hero = "";
      el.style.transform = transform;
      frame.style.setProperty("--hero-left", `${heroLeft}px`);
      if (!moving) {
        // Let the jump land before transitions come back on.
        void el.offsetWidth;
        el.style.transition = "";
      }
      frame.dataset.placed = "";
    };
    const unplace = (slug: string, moving: boolean) => {
      const el = sectionOf(slug);
      sections.forEach((other) => delete other.dataset.away);
      if (!el) return;
      el.style.transition = moving ? "" : "none";
      el.style.transform = "";
      if (!moving) {
        void el.offsetWidth;
        el.style.transition = "";
      }
    };

    if (now) {
      // Opening — or one study in place of another, swiped to or from the
      // back and forward buttons: the one going shrinks away to its side as
      // the next grows in from the other.
      if (was) {
        const old = sectionOf(was);
        if (old) {
          old.style.transition = animate ? "" : "none";
          old.style.transform = "";
          delete old.dataset.hero;
        }
      }
      enterClip();
      root.dataset.studyOpen = "";
      if (window.scrollY > 0)
        window.scrollTo({ top: 0, behavior: animate ? "smooth" : "auto" });
      place(now, animate);
      return;
    }

    // Closing: back to the top of the page first, then the cover shrinks back
    // into the strip and everything else comes back round it.
    setClosing(was);
    const shrink = () => {
      delete root.dataset.studyOpen;
      unplace(was!, animate);
      timers.current.push(
        setTimeout(
          () => {
            delete sectionOf(was!)?.dataset.hero;
            leaveClip();
            setClosing(null);
          },
          animate ? GROW : 0,
        ),
      );
    };
    if (window.scrollY > 2 && animate) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const startedAt = performance.now();
      const wait = () => {
        if (window.scrollY <= 2 || performance.now() - startedAt > 900) shrink();
        else requestAnimationFrame(wait);
      };
      requestAnimationFrame(wait);
    } else {
      window.scrollTo({ top: 0 });
      shrink();
    }
  }, [openSlug]);

  // From one open study to the next or the one before, in the order the strip
  // has them: a sideways swipe on a trackpad, or a drag with a mouse. Only
  // on the first screen of a study — scrolled down into the writing, the
  // page is being read, and sideways means nothing. Nothing past either end.
  //
  // The direction is the strip's: swiping or dragging the way that would
  // bring the covers on the right into view brings the next study. The
  // address is replaced rather than added to, so the back button still goes
  // home rather than back through every study swiped past.
  // Held across studies: the listeners are set up again for each one, and a
  // swipe that has just moved on must not move on again in the next.
  const swipe = useRef({
    busyUntil: 0,
    travelled: 0,
    lastAt: -Infinity,
    lastSize: 0,
    lastSign: 0,
    shrinking: 0,
    coasting: false,
    floor: Infinity,
    fired: false,
  });
  useEffect(() => {
    if (!openSlug || closing) return;
    const order = Object.keys(studies);
    const root = document.documentElement;
    const atTop = () => window.scrollY <= 8;
    const g = swipe.current;
    const go = (step: 1 | -1) => {
      if (performance.now() < g.busyUntil) return;
      const next = order[order.indexOf(openSlug) + step];
      if (!next) return;
      g.busyUntil = performance.now() + SWIPE_REST;
      setOpen(next);
      window.history.replaceState(null, "", `/${next}`);
    };

    // A swipe is one push however long its coasting runs on: it moves on once
    // it has gone SWIPE_STEP px, and not again for the rest of that swipe.
    // The coasting after the fingers lift runs on for up to a second, and the
    // next swipe often starts inside it, so a new swipe is not waited for as a
    // gap: it is a push that grows where coasting only ever shrinks, or one the
    // other way — or, failing both, a moment of quiet.
    const wheel = (e: WheelEvent) => {
      if (!atTop() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const size = Math.abs(e.deltaX);
      const sign = Math.sign(e.deltaX);
      // Coasting is two shrinking pushes in a row or more, and from then on
      // its lowest push is kept: a new swipe climbs well back above it. A
      // swipe getting up to speed grows too, before it has coasted at all,
      // and is not mistaken for a new one.
      const fresh =
        e.timeStamp - g.lastAt > 250 ||
        sign !== g.lastSign ||
        (g.coasting && size > 6 && size > g.floor * 2);
      if (fresh) {
        g.travelled = 0;
        g.fired = false;
        g.shrinking = 0;
        g.coasting = false;
        g.floor = Infinity;
      } else {
        g.shrinking = size < g.lastSize ? g.shrinking + 1 : 0;
        if (g.shrinking >= 2) g.coasting = true;
        if (g.coasting) g.floor = Math.min(g.floor, size);
      }
      g.lastAt = e.timeStamp;
      g.lastSize = size;
      g.lastSign = sign;
      if (g.fired) return;
      g.travelled += e.deltaX;
      if (Math.abs(g.travelled) < SWIPE_STEP) return;
      g.fired = true;
      go(g.travelled > 0 ? 1 : -1);
    };

    let drag: { x: number; moved: boolean } | null = null;
    let suppress = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || !atTop()) return;
      if (root.classList.contains("gravity-on")) return;
      // The grown cover is a link, but a press on it does nothing while it is
      // open, so it is as good a handle as the white. Any other link is left
      // to be a link.
      const target = e.target as Element;
      if (
        target.closest("button, input, textarea, select, video[controls]") ||
        (target.closest("a") && !target.closest("[data-hero]"))
      )
        return;
      e.preventDefault();
      drag = { x: e.clientX, moved: false };
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      if (!drag.moved && Math.abs(e.clientX - drag.x) < DRAG) return;
      if (!drag.moved) {
        drag.moved = true;
        root.dataset.dragging = "";
      }
    };
    const up = (e: PointerEvent) => {
      const d = drag;
      drag = null;
      if (!d?.moved) return;
      delete root.dataset.dragging;
      suppress = true;
      setTimeout(() => (suppress = false), 0);
      const dx = e.clientX - d.x;
      if (Math.abs(dx) >= SWIPE_STEP) go(dx < 0 ? 1 : -1);
    };
    const click = (e: MouseEvent) => {
      if (!suppress) return;
      suppress = false;
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("click", click, true);
      delete root.dataset.dragging;
    };
  }, [openSlug, closing, studies, setOpen]);

  // Back to the homepage by pulling down from the top of a study's first
  // screen — a swipe up on a trackpad, or the wheel turned up. Not on the
  // first touch: the first screen comes down with the pull, against a
  // resistance that grows, and only a pull of PULL_CLOSE px puts the study
  // away; let go short of that and it springs back. Only a swipe that starts
  // with the page at its top counts, so coasting up out of the study and
  // into the top of it does not close anything.
  useEffect(() => {
    if (!openSlug || closing) return;
    const frame = frameRef.current;
    if (!frame) return;
    let amount = 0;
    let armed = false;
    let lastAt = -Infinity;
    let lastSize = 0;
    let lastSign = 0;
    let shrinking = 0;
    let coasting = false;
    let floor = Infinity;
    let quiet = 0;
    const show = (springing: boolean) => {
      frame.style.transition = springing
        ? "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";
      frame.style.transform = amount
        ? `translate3d(0, ${give(amount)}px, 0)`
        : "";
    };
    const letGo = () => {
      clearTimeout(quiet);
      armed = false;
      if (!amount) return;
      amount = 0;
      show(true);
    };
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const size = Math.abs(e.deltaY);
      const sign = Math.sign(e.deltaY);
      // A new swipe, told from the last one's coasting as the sideways
      // swipes are — see the swipe between studies above.
      const fresh =
        e.timeStamp - lastAt > 250 ||
        sign !== lastSign ||
        (coasting && size > 6 && size > floor * 2);
      if (fresh) {
        shrinking = 0;
        coasting = false;
        floor = Infinity;
        armed = sign < 0 && window.scrollY <= 0;
      } else {
        shrinking = size < lastSize ? shrinking + 1 : 0;
        if (shrinking >= 2) coasting = true;
        if (coasting) floor = Math.min(floor, size);
      }
      lastAt = e.timeStamp;
      lastSize = size;
      lastSign = sign;
      if (!armed) return;
      // The fingers have lifted short of the mark: back it goes.
      if (coasting && amount < PULL_CLOSE) return letGo();
      amount = Math.max(0, amount - e.deltaY);
      if (amount >= PULL_CLOSE) {
        letGo();
        return close();
      }
      show(false);
      clearTimeout(quiet);
      quiet = window.setTimeout(letGo, 150);
    };
    window.addEventListener("wheel", wheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", wheel);
      clearTimeout(quiet);
      // Mid-pull, put it straight back; a spring already on its way home is
      // left to finish.
      if (amount) frame.style.transform = "";
    };
  }, [openSlug, closing, close]);

  // A resize while open: the cover is put where it now belongs, at once.
  useEffect(() => {
    if (!openSlug) return;
    const resize = () => {
      const frame = frameRef.current;
      const el = scrollerRef.current?.querySelector<HTMLElement>(
        `section[data-slug="${openSlug}"]`,
      );
      if (!frame || !el) return;
      el.style.transition = "none";
      el.style.transform = "";
      const { transform, heroLeft } = growTo(el, frame);
      el.style.transform = transform;
      frame.style.setProperty("--hero-left", `${heroLeft}px`);
      void el.offsetWidth;
      el.style.transition = "";
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [openSlug]);

  // Scrolling down a homepage with nothing open, with the pointer over a
  // cover, opens that cover's study. The page is the name and the
  // strip and not much else, so a scroll down is read as going on into the
  // work. Only once the page has nothing further down to show — on a window
  // too short for the whole strip, the first scroll still brings the rest of
  // it into view. With a study open, scrolling is just the page scrolling,
  // down into the study.
  //
  // A wheel or a trackpad only: on a phone a swipe down is how the page is
  // read, and opens nothing.
  useEffect(() => {
    if (shown) return;
    // A sideways swipe on a trackpad drifts up and down a little as it goes,
    // and that drift is not a scroll down. So a scroll down has to be clearly
    // more down than sideways, and none counts for SIDEWAYS_QUIET ms after
    // any sideways movement.
    let sidewaysAt = -Infinity;
    const wheel = (e: WheelEvent) => {
      const across = Math.abs(e.deltaX);
      if (across > 0 && across * 1.5 >= Math.abs(e.deltaY)) {
        sidewaysAt = e.timeStamp;
        return;
      }
      if (e.deltaY <= 0) return;
      if (e.timeStamp - sidewaysAt < SIDEWAYS_QUIET) return;
      if (document.documentElement.classList.contains("gravity-on")) return;
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight < doc.scrollHeight - 2) return;
      // Only over a cover: a scroll down anywhere else opens nothing.
      const over = (e.target as Element).closest?.("[data-slug]");
      const slug = over?.getAttribute("data-slug");
      if (slug && studies[slug]) press(slug);
    };
    window.addEventListener("wheel", wheel, { passive: true });
    return () => window.removeEventListener("wheel", wheel);
  }, [shown, press, studies]);

  const study = shown ? studies[shown] : undefined;
  const intro = shown ? intros[shown] : undefined;

  return (
    <OpenContext.Provider value={{ openSlug, press }}>
      {/* The frame — the name, the intro, the corner and the strip — and,
          below it, the open study.

          From sm up the frame is at least a window tall and its contents are
          centred in it, starting at --frame-top. Everything in it is measured
          in --u, so as the window narrows the whole picture shrinks, and
          centred it shrinks towards the middle of the window. The frame's top
          is --frame-top, worked out in globals.css rather than left to flex to
          centre, so the layout can put the corner on the same line on every
          page — see corner.tsx.

          With a study open the frame is the first screen of it: the cover
          grown large on the right, its name and facts on the left, and the
          study itself below, a scroll away. */}
      <div>
        <div
          ref={frameRef}
          data-frame
          data-open={openSlug ? "" : undefined}
          // The white is a handle — for the strip while nothing is open (see
          // useStripDrag), and from one study to the next while one is.
          className={`relative cursor-grab sm:pb-[calc(24*var(--u))] sm:pt-[var(--frame-top)] ${
            shown ? "min-h-svh" : "sm:min-h-svh"
          }`}
        >
          <div className="relative">
            <div data-home-header>{header}</div>
            <div
              // Out to both of the window's edges, past the band's: on a
              // window wider than the band the covers run on into the white
              // beside it rather than being cut off at the band's edge. The
              // margins are that white — --gutter — and come to nothing on a
              // window the band fills. The strip pads its start by the same
              // amount, so the first cover still starts on the name's line.
              data-strip
              className="-mx-[var(--gutter)] mt-16 sm:mt-[calc(64*var(--u))]"
            >
              <CoverStrip scroller={scrollerRef} track={trackRef} slack={slackRef}>
                {children}
              </CoverStrip>
            </div>
          </div>

          {/* The open study's name, line and facts, on the left of its grown
              cover and level with the middle of it — the room up to the
              cover's left edge, --hero-left, less the page's air either side.
              Set 16px of the 1440px page above true middle, which reads as
              level where the middle itself sits low.
              From sm up: on a phone the cover takes the width, and these lead
              the study below it instead. */}
          {intro && (
            <div
              key={shown}
              data-study-intro
              className="pointer-events-none absolute left-[var(--edge)] top-[calc(50svh-16*var(--u))] hidden w-[calc(var(--hero-left)-var(--edge)-48*var(--u))] -translate-y-1/2 sm:block"
            >
              <div className="pointer-events-auto">{intro}</div>
            </div>
          )}

          {/* A down arrow under the name and facts, centred in the same room,
              saying there is more below — the study is a scroll away and
              nothing on the first screen otherwise shows it. Left to the
              white's drag rather than taking presses of its own. */}
          {intro && (
            <div
              key={`${shown}-hint`}
              aria-hidden
              data-study-hint
              className="pointer-events-none absolute left-[var(--edge)] top-[80svh] hidden w-[calc(var(--hero-left)-var(--edge)-48*var(--u))] -translate-y-1/2 justify-center text-foreground sm:flex"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-[calc(32*var(--u))]"
              >
                <path d="M12 4v16" />
                <path d="m5 13 7 7 7-7" />
              </svg>
            </div>
          )}
        </div>

        {/* Where this is, and the way back: "Home > Loot Check", top left
            where the name was, set the way the About page's is. Home is a
            link to the homepage for anything that wants one — a new tab, a
            screen reader — and a plain press puts the cover back into the
            strip rather than loading the page again. Part of the first screen,
            it scrolls away with it rather than sitting over the study's notes
            in the margin below. */}
        {shown && (
          <nav
            aria-label="Breadcrumb"
            data-study-back
            className="absolute left-[var(--edge)] top-6 z-30 flex h-11 items-center text-base leading-relaxed sm:top-[var(--frame-top)]"
          >
            <Link
              href="/"
              prefetch={false}
              onClick={(e) => {
                if (modified(e)) return;
                e.preventDefault();
                close();
              }}
              className="text-muted transition-colors duration-200 ease-out hover:text-accent"
            >
              Home
            </Link>
            <span aria-hidden className="px-2 text-muted">
              &gt;
            </span>
            <span aria-current="page">{caseStudies[shown]?.title}</span>
          </nav>
        )}

        {study && (
          // In the column the rest of the page is set in, running wider on
          // the right from 1000px — see --study-width.
          <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
            <div
              data-study
              // Room at the foot once the study is read: it is the last
              // thing on the page.
              className="mt-10 w-full pb-24 sm:mt-0 sm:pb-40 min-[1000px]:w-[var(--study-width)]"
            >
              {/* On a phone the name and facts lead the study, since there is
                  no room for them beside the cover. */}
              {intro && <div className="mb-10 sm:hidden">{intro}</div>}
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
// lets it past STRETCH, and springs back once let go; the spring itself is
// .cover-track in globals.css.
//
// A mouse lets go when its button comes up. A trackpad's let-go is the
// browser's scrollend, which it holds back for as long as the fingers are
// down — held still past the end, the row stays out until they lift, and
// then it springs straight back. scrollend comes only to something that has
// scrolled, so the strip sits in a wider box with SLACK px of room to scroll
// into at either end (see CoverStrip): a swipe that starts at an end is
// handed on to that box, scrolls it, and how far it went is the push. A
// swipe that runs into an end part-way is kept by the strip itself — the
// browser holds a swipe to the box it started in — and pushes by its own
// movement; the strip has scrolled in it, so its own scrollend marks the lift.
//
// Fingers that lift while moving leave a run of steadily shrinking events
// behind them — the coasting — and COASTING of those in a row is a let-go
// too, read without waiting for the coasting to finish. A swipe is told from
// the last by a gap of NEW_SWIPE ms. A browser with no scrollend falls back
// to HOLD ms of quiet.
const STRETCH = 100;
export const SLACK = 400;

// A bounce off an end: BOUNCE px of push for every px/ms the row arrives at,
// eased out over BOUNCE_OUT ms before it springs back — the length of the
// "out" transition on .cover-track in globals.css.
const BOUNCE = 120;
const BOUNCE_OUT = 110;
const COASTING = 3;
const HOLD = 400;
const NEW_SWIPE = 120;

/** Puts a scroll box at `left`. */
const scrollTo = (el: HTMLElement, left: number) => {
  el.scrollLeft = left;
};

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
  slack: React.RefObject<HTMLDivElement | null>,
  studyOpen: boolean,
) {
  useEffect(() => {
    const root = document.documentElement;
    // The box the strip scrolls past its ends in — see SLACK.
    const box = slack.current;
    // A browser that cannot say when a swipe is let go — see HOLD.
    const hasScrollEnd = "onscrollend" in window;
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
    // "follow": the row tracks the push frame by frame. "out": it eases out
    // to a bounce. "back": it springs home. See .cover-track in globals.css.
    const show = (mode: "follow" | "out" | "back") => {
      const el = track.current;
      if (!el) return;
      if (mode === "follow") delete el.dataset.spring;
      else el.dataset.spring = mode;
      el.style.transform = push
        ? `translate3d(${Math.sign(push) * give(push)}px, 0, 0)`
        : "";
    };
    // Set while the slack box is put back to its middle, so the scroll that
    // makes is not read as a push.
    let resetting = false;
    const recentre = () => {
      if (!box || box.scrollLeft === SLACK) return;
      resetting = true;
      scrollTo(box, SLACK);
      requestAnimationFrame(() => (resetting = false));
    };
    const release = () => {
      clearTimeout(settle);
      clearTimeout(bounce);
      recentre();
      if (!push) return;
      push = 0;
      show("back");
    };
    const max = (strip: HTMLDivElement) => strip.scrollWidth - strip.clientWidth;

    // Running into an end at `speed` px/ms (signed as the content moves:
    // positive is the row moving right): the row carries on past it by an
    // amount that grows with the speed, easing out, and springs home.
    const bounceAt = (speed: number) => {
      clearTimeout(bounce);
      push = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed)) * BOUNCE;
      show("out");
      bounce = window.setTimeout(release, BOUNCE_OUT);
    };

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
          bounceAt(v);
          return;
        }
        glide = requestAnimationFrame(step);
      };
      glide = requestAnimationFrame(step);
    };

    const down = (e: PointerEvent) => {
      const strip = scroller.current;
      if (!strip || e.pointerType !== "mouse" || e.button !== 0) return;
      // With a study open the strip is put away — its cover grown — and
      // does not drag.
      if (studyOpen) return;
      if (root.classList.contains("gravity-on")) return;
      const target = e.target as Element;
      if (!strip.contains(target)) {
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
      show("follow");
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
    // scrolls it as it always does. At an end, the swipe pushes — handed on
    // to the slack box if it started there, or kept by the strip if it ran
    // into the end part-way (`latched`). Either way the row springs back on
    // the let-go: scrollend, or the coasting.
    let lastSize = 0;
    let lastAt = 0;
    let shrinking = 0;
    let latched = false;
    // Set once a let-go has been read — the coasting, or scrollend — and
    // until the next swipe: the rest of this one is not a push.
    let spent = false;
    const wheel = (e: WheelEvent) => {
      if (studyOpen) return;
      stopGlide();
      const strip = scroller.current;
      if (!strip || drag) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const end = max(strip);
      const atStart = strip.scrollLeft <= 0 && e.deltaX < 0;
      const atEnd = strip.scrollLeft >= end - 1 && e.deltaX > 0;

      const size = Math.abs(e.deltaX);
      const prevAt = lastAt;
      if (e.timeStamp - lastAt > NEW_SWIPE) {
        // A new swipe: one that starts pushing at an end goes on to the
        // slack box; any other is the strip's to the end of it.
        latched = !atStart && !atEnd;
        spent = false;
        shrinking = 0;
        recentre();
      } else {
        shrinking = size < lastSize ? shrinking + 1 : 0;
      }
      lastSize = size;
      lastAt = e.timeStamp;
      if (still() || spent) return;

      // Coasting: the fingers have left the trackpad. Back at once.
      if (push && shrinking >= COASTING) {
        spent = true;
        return release();
      }
      if (!latched || (!push && !atStart && !atEnd)) return;
      // The coasting has carried the row into an end — the fingers are
      // already off. It bounces with the speed it arrived at, the way the
      // mouse's glide does, and the rest of the coasting is spent.
      if (!push && shrinking >= 1) {
        spent = true;
        const dt = Math.max(8, e.timeStamp - prevAt);
        return bounceAt(-e.deltaX / dt);
      }
      const next = push - e.deltaX;
      // Swiping back the other way takes the give in first, and never past
      // nothing into the other end's.
      push = push > 0 ? Math.max(0, next) : push < 0 ? Math.min(0, next) : next;
      show("follow");
      if (!hasScrollEnd) {
        clearTimeout(settle);
        settle = window.setTimeout(release, HOLD);
      }
    };

    // The slack box scrolling: a swipe handed on from an end of the strip.
    // Its distance from the middle is the push.
    const slackScroll = () => {
      if (!box || resetting || drag) return;
      if (spent || still()) return;
      push = SLACK - box.scrollLeft;
      show("follow");
      if (!hasScrollEnd) {
        clearTimeout(settle);
        settle = window.setTimeout(release, HOLD);
      }
    };
    // The fingers are off the trackpad, or a touch has let go and come to
    // rest. At an end the browser can say so while the swipe's coasting is
    // still arriving, so the rest of that swipe is spent: it must not push
    // the row back out, or the row shakes between out and back. Only a new
    // swipe pushes again.
    const letGo = () => {
      if (push) spent = true;
      release();
    };

    const strip = scroller.current;
    // The strip starts in the middle of its slack.
    recentre();
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("click", click, true);
    strip?.addEventListener("wheel", wheel, { passive: true });
    strip?.addEventListener("scrollend", letGo);
    box?.addEventListener("scroll", slackScroll, { passive: true });
    box?.addEventListener("scrollend", letGo);
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
      strip?.removeEventListener("scrollend", letGo);
      box?.removeEventListener("scroll", slackScroll);
      box?.removeEventListener("scrollend", letGo);
      delete root.dataset.dragging;
    };
  }, [scroller, track, slack, studyOpen]);
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
  slack,
  children,
}: {
  scroller: React.RefObject<HTMLDivElement | null>;
  track: React.RefObject<HTMLDivElement | null>;
  slack: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    // The slack box: as wide as the strip, with SLACK px more to scroll
    // through at either end. The strip is stuck to its left edge, so
    // scrolling the box does not move the strip at all — it is only there to
    // be scrolled, for the push and the scrollend at the ends. See SLACK.
    <div ref={slack} className="cover-slack overflow-x-auto">
      <div style={{ width: `calc(100% + ${2 * SLACK}px)` }}>
        <div
          ref={scroller}
          role="region"
          aria-label="Projects"
          tabIndex={0}
          style={{ width: `calc(100% - ${2 * SLACK}px)` }}
          className="cover-strip sticky left-0 flex overflow-x-auto py-4 pl-[calc(var(--edge)+var(--gutter))] pr-[var(--edge)] outline-none sm:py-[calc(16*var(--u))]"
        >
          <div
            ref={track}
            className="cover-track flex shrink-0 items-start gap-[120px] sm:gap-[calc(121*var(--u))]"
          >
            {children}
          </div>
        </div>
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
    // data-slug for a scroll over the cover to know which project it is over —
    // see the scroll-to-open in ProjectList.
    <section data-slug={slug} className="shrink-0">
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

// --- the phone's list -------------------------------------------------------

/**
 * The homepage on a phone: the list it was before the strip. A row per
 * project — its square cover, and beside it the name and the line saying what
 * it is — and pressing a row opens its study under it, pressing again closes
 * it. One open at a time. The same address as the strip's, so a link to a
 * study opens it here too.
 *
 * The row that was pressed is held where it is on the screen: closing a study
 * above it would otherwise pull it up the window under the finger.
 */
export function MobileList({
  rows,
  studies,
}: {
  /** Each project's row — its cover and writing — in order, by slug. */
  rows: { slug: string; row: React.ReactNode }[];
  /** Each project's rendered study, by slug. */
  studies: Record<string, React.ReactNode>;
}) {
  const wide = useIsWide();
  const [addressed, , write] = useAddressedSlug();
  const openSlug = wide ? null : addressed;
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const toggle = (slug: string) => {
    const row = refs.current[slug];
    const before = row?.getBoundingClientRect().top;
    flushSync(() => write(openSlug === slug ? null : slug));
    const after = row?.getBoundingClientRect().top;
    if (before !== undefined && after !== undefined && after !== before)
      window.scrollBy(0, after - before);
  };

  return (
    // No top margin: the name's own sets the room above the first row, held
    // equal to the room between the corner and the name — see the h1 in
    // design-one.tsx. pb-6: a little more air after the last row, before the
    // foot of the page.
    <div className="mx-auto flex w-[var(--column)] max-w-[calc(100%-3rem)] flex-col items-start gap-16 pb-6">
      {rows.map(({ slug, row }) => {
        const study = studies[slug];
        const open = !!study && openSlug === slug;
        return (
          <section
            key={slug}
            ref={(el) => {
              refs.current[slug] = el;
            }}
            className="w-full"
          >
            <ToggleContext.Provider
              value={study ? { open, toggle: () => toggle(slug) } : null}
            >
              <ProjectRow className="relative flex items-center gap-[var(--cover-gap)]">
                {row}
              </ProjectRow>
            </ToggleContext.Provider>
            {open && <div className="study-in mt-10 w-full">{study}</div>}
          </section>
        );
      })}
    </div>
  );
}
